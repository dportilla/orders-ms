import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { PRODUCT_SERVICE } from '@/config/product.services';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
	imports: [
		PrismaModule,
		ClientsModule.registerAsync([
			{
				name: PRODUCT_SERVICE,
				inject: [ConfigService],
				useFactory: (configService: ConfigService) => ({
					transport: Transport.TCP,
					options: {
						host: configService.getOrThrow('products.host'),
						port: configService.getOrThrow('products.port'),
					},
				}),
			},
		]),
	],
	controllers: [OrdersController],
	providers: [OrdersService],
})
export class OrdersModule {}
