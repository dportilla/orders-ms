import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';

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
}
