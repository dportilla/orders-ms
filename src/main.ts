import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const configService = app.get(ConfigService);

	const logger = new Logger('Orders-MS');

	const port = configService.getOrThrow<number>('app.port');

	await app.listen(port);
	logger.log(`Orders microservice is running on port ${port}`);
}
bootstrap();
