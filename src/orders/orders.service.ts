import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/common/prisma/prisma.service';
import { ChangeOrderStatusDto } from '@/orders/dto/change-order.dto';
import { OrderStatusList } from '@/orders/enum/order.enum';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
	constructor(private prisma: PrismaService) {}

	async create(createOrderDto: CreateOrderDto) {
		const order = await this.prisma.order.create({
			data: createOrderDto,
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
