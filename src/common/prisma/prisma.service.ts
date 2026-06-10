import {
	Injectable,
	Logger,
	OnModuleDestroy,
	OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	private readonly logger = new Logger(PrismaService.name);

	constructor(configService: ConfigService) {
		const adapter = new PrismaPg({
			connectionString: configService.getOrThrow('db.url'),
		});

		super({
			adapter,
			log: ['info', 'warn', 'error'],
		});
	}

	async onModuleInit() {
		this.logger.log('Prisma Service Initialized');
	}
	async onModuleDestroy() {
		this.logger.log('Prisma Service Destroyed');
	}
}
