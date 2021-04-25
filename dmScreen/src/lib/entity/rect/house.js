import { Rect } from './rect';
import colors from '$lib/colors';

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

	getType() {
		return House.getType();
	}
	static getType() {
		return 'house';
	}
}
