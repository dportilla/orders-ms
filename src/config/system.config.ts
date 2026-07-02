import appConfig from '@/config/app.config';
import dbConfig from '@/config/db.config';
import natsServer from '@/config/nats.server';

export const systemConfig = [appConfig, dbConfig, natsServer];
