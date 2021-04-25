import { Rect } from './rect';
import colors from '$lib/colors';

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

	getType() {
		return Farm.getType();
	}
	static getType() {
		return 'farm';
	}
}
