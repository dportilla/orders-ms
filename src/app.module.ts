import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from '@/config/env.validations';
import { systemConfig } from '@/config/system.config';
import { PrismaModule } from './common/prisma/prisma.module';
import { OrdersModule } from './orders/orders.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: envValidationSchema,
			load: systemConfig,
		}),
		OrdersModule,
		PrismaModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
