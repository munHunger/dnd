export class Entity {
	/**
	 * @type {import ('./quadTree').Rect}
	 */
	bounds;
	inputs = [];
	mouse;

	/**
	 * @param {import ('./quadTree').Element} elem
	 */
	constructor(elem) {
		if (!elem) return;
		this.bounds = elem.bounds;
	}

	/**
	 * @param {number} x position in mapspace
	 * @param {number} y position in mapspace
	 * @param {boolean} ctrl if ctrl key is down
	 * @param {boolean} shift if shift key is down
	 * @param {import('./quadTree').Tree} tree
	 * @returns {Entity} if it built, undefined otherwise
	 */
	click(x, y, ctrl, shift, tree) {
		this.inputs.push({ x, y });
		if (this.isValid()) return this.build(tree);
	}

	setMouse(x, y) {
		this.mouse = { x, y };
	}

	/**
	 * @param {import('./quadTree').Tree} tree
	 */
	build(tree) {
		throw 'build not implemented';
	}
	isValid() {
		throw 'isValid not implemented';
	}
	getType() {
		throw 'getType not implemented';
	}

	/**
	 * @param {import('roughjs/bin/canvas').RoughCanvas} rc
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {*} options
	 */
	render(rc, ctx, options) {
		throw 'render not implemented';
	}
	getRotation(a, b) {
		let dX = a.x - b.x;
		let dY = a.y - b.y;
		return Math.atan2(dY, dX);
	}

	static rotatePoint(origin, point, angle) {
		return {
			x: Math.cos(angle) * (point.x - origin.x) - Math.sin(angle) * (point.y - origin.y) + origin.x,
			y: Math.sin(angle) * (point.x - origin.x) + Math.cos(angle) * (point.y - origin.y) + origin.y
		};
	}
}
