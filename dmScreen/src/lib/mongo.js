import MongoClient from 'mongodb';
import { logger } from './logger';

// Connection URL
const url = process.env['MONGO_URL'] || 'mongodb://localhost:27017';
logger.info('initializing mongo url=' + url);
const user = process.env['MONGO_USER'] || 'root';
const password = process.env['MONGO_PASSWORD'] || 'example';
/**
 * @param {string} name
 * @returns {Promise<import('mongodb').Collection>}
 */
export function collection(name) {
	// Database Name
	const dbName = 'dmScreen';
	return new Promise((resolve, reject) =>
		MongoClient.connect(url, { auth: { user, password } }).then((c) => {
			c.db(dbName).collection(name, (err, res) => {
				if (err) return reject(err);
				resolve(res);
			});
		})
	);
}

export default {
	collection
};
