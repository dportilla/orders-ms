import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from '@/config/env.validations';
import { systemConfig } from '@/config/system.config';
import { OrdersModule } from './orders/orders.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: envValidationSchema,
			load: systemConfig,
		}),
		OrdersModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
