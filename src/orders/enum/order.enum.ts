export enum OrderStatusEnum {
	PENDING = 'PENDING',
	PAID = 'PAID',
	SHIPPED = 'SHIPPED',
	DELIVERED = 'DELIVERED',
	CANCELLED = 'CANCELLED',
}

export const OrderStatusList = [
	OrderStatusEnum.PENDING,
	OrderStatusEnum.PAID,
	OrderStatusEnum.SHIPPED,
	OrderStatusEnum.DELIVERED,
	OrderStatusEnum.CANCELLED,
];
