import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { NATS_SERVICE } from '@/config/system.services';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
	imports: [
		PrismaModule,
		ClientsModule.registerAsync([
			{
				name: NATS_SERVICE,
				inject: [ConfigService],
				useFactory: (configService: ConfigService) => ({
					transport: Transport.NATS,
					options: {
						servers: configService.getOrThrow('nats.servers'),
					},
				}),
			},
		]),
	],
	controllers: [OrdersController],
	providers: [OrdersService],
})
export class OrdersModule {}
