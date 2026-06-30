import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';
import { PRODUCT_SERVICE } from '@/config/product.services';
import { ChangeOrderStatusDto } from '@/orders/dto/change-order.dto';
import { OrderStatusList } from '@/orders/enum/order.enum';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
	constructor(
		private prisma: PrismaService,
		@Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
	) {}

	async create(createOrderDto: CreateOrderDto) {
		const productsIds = createOrderDto.items.map((item) => item.productId);

		let products: { id: number; price: number }[];
		try {
			products = await firstValueFrom(
				this.productsClient.send({ cmd: 'validate_product_ids' }, productsIds),
			);
		} catch (error) {
			if (error instanceof RpcException) throw error;

			const errorResponse = error as Record<string, unknown>;
			throw new RpcException({
				status: (errorResponse.status as number) ?? HttpStatus.NOT_FOUND,
				message:
					(errorResponse.message as string) ??
					`Products with IDs ${productsIds.join(', ')} not found`,
			});
		}

		const productsMap = new Map(
			products.map((product) => [product.id, product]),
		);

		const totalAmount = createOrderDto.items.reduce((total, item) => {
			// biome-ignore lint/style/noNonNullAssertion: Non-null assertion is safe here because we have already validated that all product IDs exist
			const product = productsMap.get(item.productId)!;
			return total + item.quantity * product.price;
		}, 0);

		const totalItems = createOrderDto.items.reduce(
			(total, item) => total + item.quantity,
			0,
		);

		const order = await this.prisma.order.create({
			data: {
				totalAmount,
				totalItems,
				orderItems: {
					createMany: {
						data: createOrderDto.items.map((item) => ({
							productId: item.productId,
							quantity: item.quantity,
							// biome-ignore lint/style/noNonNullAssertion: Non-null assertion is safe here because we have already validated that all product IDs exist
							price: productsMap.get(item.productId)!.price,
						})),
					},
				},
			},
			include: {
				orderItems: {
					select: {
						productId: true,
						quantity: true,
						price: true,
					},
				},
			},
		});

		return order;
	}

	async findAll(paginationDto: PaginationDto) {
		const { page = 1, limit = 10 } = paginationDto;
		const totalOrders = await this.prisma.order.count();
		const lastPage = Math.ceil(totalOrders / limit);
		const skip = (page - 1) * limit;
		const take = limit;
		const orders = await this.prisma.order.findMany({
			skip,
			take,
		});
		return {
			data: orders,
			meta: {
				totalItems: totalOrders,
				totalPages: lastPage,
				currentPage: page,
				itemsPerPage: limit,
				hasPreviousPage: page > 1,
				hasNextPage: page < lastPage,
				nextPage: page < lastPage ? page + 1 : null,
				previousPage: page > 1 ? page - 1 : null,
			},
		};
	}

	async findOne(id: string) {
		const order = await this.prisma.order.findUnique({
			where: { id },
		});

		if (!order) {
			throw new RpcException({
				status: HttpStatus.NOT_FOUND,
				message: `Order with id ${id} not found`,
				error: 'Not Found',
			});
		}

		return order;
	}

	async changeOrderStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
		const { id, status } = changeOrderStatusDto;
		if (!(OrderStatusList as string[]).includes(status)) {
			throw new RpcException({
				status: HttpStatus.BAD_REQUEST,
				message: `Status must be one of: ${OrderStatusList.join(', ')}`,
			});
		}
		await this.findOne(id);

		return this.prisma.order.update({
			where: { id },
			data: { orderStatus: status },
		});
	}
}
