import { MongoClient } from 'mongodb';

/**
 * @param {string} name
 * @returns {Promise<import('mongodb').Collection>}
 */
export function collection(name) {
	// Connection URL
	const url = process.env.MONGO_URL || 'mongodb://localhost:27017';

	// Database Name
	const dbName = 'dmScreen';
	return new Promise((resolve, reject) =>
		MongoClient.connect(url, { auth: { user: 'root', password: 'example' } }).then((c) => {
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
