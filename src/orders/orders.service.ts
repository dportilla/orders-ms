import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from '@/common/prisma/prisma.service';
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

	async findAll() {
		return `This action returns all orders`;
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
