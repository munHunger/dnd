import colors from '$lib/colors';
import { allTypes, toEntity } from './entity';
export let types = allTypes();

/**
 *
 * @param {import('./quadTree').Element} elem
 * @param {import('roughjs/bin/canvas').RoughCanvas} rc
 * @param {*} options
 */
export function drawElement(elem, rc, options) {
	let x = elem.bounds.x * options.zoom;
	let y = elem.bounds.y * options.zoom;
	let width = elem.bounds.width * options.zoom;
	let height = elem.bounds.height * options.zoom;
	let element = toEntity(elem);
	if (element) {
		element.render(rc, options);
	} else {
		//TODO: remove and create entity
		if (elem.obj.type === 'greble')
			rc.line(x, y, x + width, y + height, {
				stroke: colors.soft,
				roughness: 6
			});
	}
}

function rotatePoint(origin, point, angle) {
	return {
		x: Math.cos(angle) * (point.x - origin.x) - Math.sin(angle) * (point.y - origin.y) + origin.x,
		y: Math.sin(angle) * (point.x - origin.x) + Math.cos(angle) * (point.y - origin.y) + origin.y
	};
}

export default {
	drawElement,
	types
};
