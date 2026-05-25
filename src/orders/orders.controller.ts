import { Controller, NotImplementedException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@Controller()
export class OrdersController {
	constructor(private readonly ordersService: OrdersService) {}

	@MessagePattern({ cmd: 'create_order' })
	create() {
		return this.ordersService.create();
	}

	@MessagePattern({ cmd: 'get_all_orders' })
	findAll() {
		return this.ordersService.findAll();
	}

	@MessagePattern({ cmd: 'get_one_order' })
	findOne(@Payload('id') id: string) {
		return this.ordersService.findOne(id);
	}

	@MessagePattern({ cmd: 'change_order_status' })
	changeOrderStatus() {
		throw new NotImplementedException('This method is not implemented yet');
	}
}
