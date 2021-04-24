import colors from './colors';

export class Entity {
	/**
	 * @type {import ('./quadTree').Rect}
	 */
	bounds;
	inputs = [];

	/**
	 * @param {import ('./quadTree').Element} elem
	 */
	constructor(elem) {
		if (!elem) return;
		this.bounds = elem.bounds;
	}

	click(x, y) {
		this.inputs.push({ x, y });
		if (this.isValid()) return this.build();
	}

	build() {
		throw 'not implemented';
	}
	isValid() {
		throw 'not implemented';
	}
	getType() {
		throw 'not implemented';
	}

	/**
	 * @param {import('roughjs/bin/canvas').RoughCanvas} rc
	 * @param {*} options
	 */
	render(rc, options) {}
	getRotation(a, b) {
		let dX = a.x - b.x;
		let dY = a.y - b.y;
		return Math.atan2(dY, dX);
	}

	/**
	 * @param {import('./quadTree').Element} element
	 * @returns {Entity}
	 */
	static toEntity(element) {
		switch (element.obj.type) {
			case House.getType():
				return new House(element);
			case Farm.getType():
				return new Farm(element);
			case Tree.getType():
				return new Tree(element);
		}
	}

	static rotatePoint(origin, point, angle) {
		return {
			x: Math.cos(angle) * (point.x - origin.x) - Math.sin(angle) * (point.y - origin.y) + origin.x,
			y: Math.sin(angle) * (point.x - origin.x) + Math.cos(angle) * (point.y - origin.y) + origin.y
		};
	}
}

export class Tree extends Entity {
	build() {
		let elem = {
			obj: { type: 'tree' },
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
		let x = this.bounds.x * options.zoom;
		let y = this.bounds.y * options.zoom;
		let width = this.bounds.width * options.zoom;
		let height = this.bounds.height * options.zoom;
		rc.ellipse(x + width / 2, y + height / 2, width, height, {
			fill: colors.shaded,
			stroke: colors.line,
			fillStyle: 'solid',
			roughness: 6
		});
	}
	isValid() {
		return this.inputs.length === 2;
	}

	static getType() {
		return 'tree';
	}
}
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
		let x = this.bounds.x * options.zoom;
		let y = this.bounds.y * options.zoom;
		let width = this.bounds.width * options.zoom;
		let height = this.bounds.height * options.zoom;
		let x2 = x + width;
		let y2 = y + height;
		let origin = { x, y };
		let points = [origin, { x: x2, y }, { x: x2, y: y2 }, { x, y: y2 }]
			.map((p) => Entity.rotatePoint(origin, p, this.rotation))
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
		throw 'not implemented';
	}
	isValid() {
		return this.inputs.length === 3;
	}
}

export class House extends Rect {
	/**
	 * @param {import('roughjs/bin/canvas').RoughCanvas} rc
	 * @param {number} x origin
	 * @param {number} y origin
	 * @param {Array<number>} points list of points relative to origin
	 */
	draw(rc, x, y, points) {
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

	static getType() {
		return 'house';
	}
}
export class Farm extends Rect {
	/**
	 * @param {import('roughjs/bin/canvas').RoughCanvas} rc
	 * @param {number} x origin
	 * @param {number} y origin
	 * @param {Array<number>} points list of points relative to origin
	 */
	draw(rc, x, y, points) {
		rc.path(`M${x} ${y} L ${points} Z`, {
			fill: colors.light,
			stroke: colors.light,
			fillStyle: 'hachure',
			//fillStyle: 'solid',
			fillWeight: 3,
			hachureGap: 10,
			hachureAngle: -(this.rotation / (2 * Math.PI)) * 360 + (Math.random() > 0.5 ? 0 : 90),
			roughness: 1
		});
	}

	static getType() {
		return 'farm';
	}
}
