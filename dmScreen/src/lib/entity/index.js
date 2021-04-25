export * from './entity';
export * from './tree';
export * from './line';
export * from './marker';
export * from './rect/house';
export * from './rect/farm';

import { House } from './rect/house';
import { Farm } from './rect/farm';
import { Tree } from './tree';
import { Line } from './line';
import { Marker } from './marker';

/**
 * @param {import('./quadTree').Element} element
 * @returns {Entity}
 */
export function toEntity(element) {
	switch (element.obj.type) {
		case House.getType():
			return new House(element);
		case Farm.getType():
			return new Farm(element);
		case Tree.getType():
			return new Tree(element);
		case Line.getType():
			return new Line(element);
		case Marker.getType():
			return new Marker(element);
		default:
			throw 'unrecognized type ' + element.obj.type;
	}
}

export function allTypes() {
	return [House, Farm, Tree, Line, Marker];
}
