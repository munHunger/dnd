import { Entity } from './entity';
import colors from '$lib/colors';

export class Line extends Entity {
	points = [];
	constructor(elem) {
		super(elem);
		if (elem) this.points = elem.obj.points || [];
	}
	/**
	 * @param {number} x position in mapspace
	 * @param {number} y position in mapspace
	 * @param {boolean} ctrl if ctrl key is down
	 * @param {boolean} shift if shift key is down
	 * @returns {Entity} if it built, undefined otherwise
	 */
	click(x, y, ctrl, shift) {
		this.inputs.push({ x, y });
		if (ctrl) return this.build();
	}
	build() {
		let elem = {
			obj: { type: this.getType(), points: this.inputs },
			bounds: {
				x: this.inputs[0].x,
				y: this.inputs[0].y,
				width: this.inputs[1].x - this.inputs[0].x,
				height: this.inputs[1].y - this.inputs[0].y
			}
		};
		return elem;
	}
	/**
	 * @param {import('roughjs/bin/canvas').RoughCanvas} rc
	 * @param {*} options
	 */
	render(rc, options) {
		let points = this.inputs
			.concat(this.mouse)
			.concat(this.points)
			.filter((v) => v);
		if (this.bounds && points.length == 0) {
			//used by thumbnail
			points = points.concat([
				{ x: 0, y: 0 },
				{ x: 0.5, y: 0.25 },
				{ x: 0.25, y: 0.5 },
				{ x: 1, y: 1 }
			]);
		}
		if (points.length > 1) {
			console.log('rending line');
			console.log(this);
			console.log(options);
			let xOffset = ((this.bounds || {}).x || points[0].x) - points[0].x;
			let yOffset = ((this.bounds || {}).y || points[0].y) - points[0].y;
			console.log([xOffset, yOffset]);
			let path = points.map((i) => [
				(i.x - (((options || {}).camera || {}).x || 0) + xOffset) * options.zoom,
				(i.y - (((options || {}).camera || {}).y || 0) + yOffset) * options.zoom
			]);
			rc.linearPath(path, {
				stroke: colors.line,
				roughness: 2
			});
		}
	}
	getType() {
		return Line.getType();
	}
	static getType() {
		return 'line';
	}
}
