import { Entity } from '../';

export class Rect extends Entity {
	rotation;
	constructor(elem) {
		super(elem);
		if (elem) this.rotation = elem.obj.rotation || 0;
	}
	build() {
		let elem = {
			obj: { type: this.getType() },
			bounds: {
				x: this.inputs[0].x,
				y: this.inputs[0].y,
				width: this.inputs[1].x - this.inputs[0].x,
				height: this.inputs[1].y - this.inputs[0].y
			}
		};
		let internalRot = super.getRotation(
			{
				x: 0,
				y: 0
			},
			{
				x: elem.bounds.width,
				y: elem.bounds.height
			}
		);
		let mouseRot = super.getRotation(
			{
				x: elem.bounds.x,
				y: elem.bounds.y
			},
			{ x: this.inputs[2].x, y: this.inputs[2].y }
		);
		elem.obj.rotation = mouseRot - internalRot;
		return elem;
	}

	/**
	 * @param {import('roughjs/bin/canvas').RoughCanvas} rc
	 * @param {*} options
	 */
	render(rc, options) {
		let bounds = this.bounds || {
			x: this.inputs[0].x,
			y: this.inputs[0].y,
			width: (this.inputs[1] || this.mouse || {}).x - this.inputs[0].x || 1,
			height: (this.inputs[1] || this.mouse || {}).y - this.inputs[0].y || 1
		};
		let x = (bounds.x - (((options || {}).camera || {}).x || 0)) * options.zoom;
		let y = (bounds.y - (((options || {}).camera || {}).y || 0)) * options.zoom;
		let width = bounds.width * options.zoom;
		let height = bounds.height * options.zoom;
		let x2 = x + width;
		let y2 = y + height;
		let origin = { x, y };

		let rotation = this.rotation;
		if (!rotation && this.inputs.length > 1) {
			let internalRot = super.getRotation(
				{
					x: 0,
					y: 0
				},
				{
					x: bounds.width,
					y: bounds.height
				}
			);
			let mouseRot = super.getRotation(
				{
					x: bounds.x,
					y: bounds.y
				},
				{ x: this.mouse.x, y: this.mouse.y }
			);
			rotation = mouseRot - internalRot;
		}

		let points = [origin, { x: x2, y }, { x: x2, y: y2 }, { x, y: y2 }]
			.map((p) => Entity.rotatePoint(origin, p, rotation || 0))
			.map((p) => `${p.x} ${p.y}`)
			.join(' ');
		this.draw(rc, x, y, points);
	}
	/**
	 * @param {import('roughjs/bin/canvas').RoughCanvas} rc
	 * @param {number} x origin
	 * @param {number} y origin
	 * @param {Array<number>} points list of points relative to origin
	 */
	draw(rc, x, y, points) {
		throw 'draw not implemented';
	}
	isValid() {
		return this.inputs.length === 3;
	}
}
