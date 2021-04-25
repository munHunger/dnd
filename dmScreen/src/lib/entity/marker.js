import { Entity } from './entity';
import colors from '$lib/colors';

export class Marker extends Entity {
	/**
	 * @type {string}
	 */
	legend;
	/**
	 * @type {number}
	 */
	id;
	constructor(elem) {
		super(elem);
		if (elem) {
			this.legend = elem.obj.legend || '';
			this.id = elem.obj.id || 'M';
		}
	}
	build() {
		let elem = {
			obj: { type: Marker.getType(), legend: this.legend, id: Math.floor(Math.random() * 100) },
			bounds: {
				x: this.inputs[0].x,
				y: this.inputs[0].y,
				width: 1,
				height: 1
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
			y: this.inputs[0].y
		};
		let x = (bounds.x - (((options || {}).camera || {}).x || 0)) * options.zoom;
		let y = (bounds.y - (((options || {}).camera || {}).y || 0)) * options.zoom;
		let width = bounds.width * options.zoom;
		let height = bounds.height * options.zoom;
		rc.ellipse(x + width / 2, y + height / 2, width, height, {
			fill: colors.shaded,
			stroke: colors.line,
			roughness: 1
		});
		ctx.font = `${height}px 'Indie Flower'`;
		ctx.fillText(this.id, x + width / 6, y + height - height / 4);
		ctx.font = `1.5rem 'Indie Flower'`;
		console.log(options.markers);
		if (this.legend && options.canvas)
			ctx.fillText(
				this.id + ':' + this.legend,
				options.canvas.width - 200,
				options.canvas.height -
					(options.markers
						.map((marker) => marker.obj.id)
						.sort()
						.indexOf(this.id) +
						1) *
						30
			);
	}
	isValid() {
		this.legend = window.prompt('Name', 'defaultText');
		return this.inputs.length === 1;
	}

	getType() {
		return Marker.getType();
	}
	static getType() {
		return 'marker';
	}
}
