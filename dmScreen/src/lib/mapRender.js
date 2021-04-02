import colors from '$lib/colors';
export let types = ['house', 'tree', 'farm', 'greble'];

/**
 *
 * @param {import('./quadTree').Element} elem
 * @param {import('roughjs/bin/canvas').RoughCanvas} rc
 * @param {*} options
 */
export function drawElement(elem, rc, options) {
	let rotation = elem.obj.rotation || 0;
	let x = elem.bounds.x * options.zoom;
	let y = elem.bounds.y * options.zoom;
	let width = elem.bounds.width * options.zoom;
	let height = elem.bounds.height * options.zoom;
	let x2 = x + width;
	let y2 = y + height;
	let origin = { x, y };
	if (elem.obj.type === 'farm') {
		let points = [origin, { x: x2, y }, { x: x2, y: y2 }, { x, y: y2 }]
			.map((p) => rotatePoint(origin, p, rotation))
			.map((p) => `${p.x} ${p.y}`)
			.join(' ');
		console.log(origin);
		console.log(points);
		rc.path(`M${x} ${y} L ${points} Z`, {
			fill: colors.light,
			stroke: colors.light,
			fillStyle: 'hachure',
			//fillStyle: 'solid',
			fillWeight: 3,
			hachureGap: 10,
			hachureAngle: Math.random() > 0.5 ? 0 : 90,
			roughness: 1
		});
	}
	if (elem.obj.type === 'house') {
		let points = [origin, { x: x2, y }, { x: x2, y: y2 }, { x, y: y2 }]
			.map((p) => rotatePoint(origin, p, rotation))
			.map((p) => `${p.x} ${p.y}`)
			.join(' ');
		console.log(origin);
		console.log(points);
		rc.path(`M${x} ${y} L ${points} Z`, {
			fill: colors.shaded,
			stroke: colors.line,
			fillStyle: 'zigzag',
			//fillStyle: 'solid',
			fillWeight: 8,
			hachureGap: 10,
			roughness: 1
		});
	}
	if (elem.obj.type === 'tree')
		rc.ellipse(x + width / 2, y + height / 2, width, height, {
			fill: colors.shaded,
			stroke: colors.line,
			fillStyle: 'solid',
			roughness: 6
		});
	if (elem.obj.type === 'greble')
		rc.line(x, y, x + width, y + height, {
			stroke: colors.soft,
			roughness: 6
		});
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
