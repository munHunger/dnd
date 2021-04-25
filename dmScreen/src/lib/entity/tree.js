import { Entity } from './entity';
import colors from '$lib/colors';

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
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {*} options
	 */
	render(rc, ctx, options) {
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

	getType() {
		return Tree.getType();
	}
	static getType() {
		return 'tree';
	}
}
