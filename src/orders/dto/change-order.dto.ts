import { IsUUID } from 'class-validator';
import { OrderStatus } from '@/generated/prisma/enums';

export class ChangeOrderStatusDto {
	@IsUUID()
	id!: string;

	status!: OrderStatus;
}
