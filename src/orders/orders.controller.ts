import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { ChangeOrderStatusDto } from '@/orders/dto/change-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@Controller()
export class OrdersController {
	constructor(private readonly ordersService: OrdersService) {}

	@MessagePattern({ cmd: 'create_order' })
	create(@Payload() createOrderDto: CreateOrderDto) {
		return this.ordersService.create(createOrderDto);
	}

	@MessagePattern({ cmd: 'get_all_orders' })
	findAll(@Payload() paginationDto: PaginationDto) {
		return this.ordersService.findAll(paginationDto);
	}

	@MessagePattern({ cmd: 'get_one_order' })
	findOne(@Payload('id', ParseUUIDPipe) id: string) {
		return this.ordersService.findOne(id);
	}

	@MessagePattern({ cmd: 'change_order_status' })
	changeOrderStatus(@Payload() changeOrderStatusDto: ChangeOrderStatusDto) {
		return this.ordersService.changeOrderStatus(changeOrderStatusDto);
	}
}
