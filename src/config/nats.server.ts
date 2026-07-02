import { registerAs } from '@nestjs/config';

export default registerAs('nats', () => ({
	servers: process.env.NATS_SERVERS?.split(',') || [],
}));
