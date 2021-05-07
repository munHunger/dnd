import { createLogger, transports } from 'winston';
import LokiTransport from 'winston-loki';
const options = {
	transports: [
		new LokiTransport({
			host: 'https://loki.munhunger.com'
		})
	]
};
const logger = createLogger(options);
logger.debug('hello world', { message: 'test', labels: { app: 'dmScreen' } });

export default { logger };
