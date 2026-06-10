import { Type } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export class CreateOrderDto {
	@IsNumber()
	@IsPositive()
	@Type(() => Number)
	totalAmount!: number;

	@IsNumber()
	@IsPositive()
	@Type(() => Number)
	totalItems!: number;
}
