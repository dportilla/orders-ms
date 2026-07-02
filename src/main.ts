import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
	const appContext = await NestFactory.createApplicationContext(AppModule);

	const configService = appContext.get(ConfigService);

	const port = configService.getOrThrow<number>('app.port');

	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		AppModule,
		{
			transport: Transport.NATS,
			options: {
				servers: configService.getOrThrow<string>('nats.servers'),
			},
		},
	);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
		}),
	);

	const logger = new Logger('Orders-MS');

	await app.listen();
	logger.log(`Orders microservice is running on port ${port}`);
}
bootstrap();
