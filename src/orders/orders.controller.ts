import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';

@Controller()
export class OrdersController {
	constructor(private readonly ordersService: OrdersService) {}

	@MessagePattern({ cmd: 'create_order' })
	create(@Payload() createOrderDto: CreateOrderDto) {
		return this.ordersService.create(createOrderDto);
	}

	@MessagePattern({ cmd: 'get_orders' })
	findAll() {
		return this.ordersService.findAll();
	}

	@MessagePattern({ cmd: 'get_order' })
	findOne(@Payload() id: number) {
		return this.ordersService.findOne(id);
	}

	@MessagePattern({ cmd: 'update_order' })
	update(@Payload() updateOrderDto: UpdateOrderDto) {
		return this.ordersService.update(updateOrderDto.id, updateOrderDto);
	}

	@MessagePattern({ cmd: 'delete_order' })
	remove(@Payload() id: number) {
		return this.ordersService.remove(id);
	}
}
