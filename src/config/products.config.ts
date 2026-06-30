import { registerAs } from '@nestjs/config';

export default registerAs('products', () => ({
	host: process.env.PRODUCTS_SERVICE_HOST,
	port: process.env.PRODUCTS_SERVICE_PORT,
}));
