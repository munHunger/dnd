import { Entity } from './entity';

/**
 * @param {Entity} elem
 */
export function pushElement(elem) {
	console.log('sending to server');
	console.log(elem);
	window
		.fetch('/index.json', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(elem)
		})
		.then((data) => data.json())
		.then((data) => {
			console.log(data);
		});
}

export default {
	pushElement
};
