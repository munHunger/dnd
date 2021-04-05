/**
 * @typedef {object} Rect
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 */

/**
 * @typedef {object} Element
 * @property {Rect} bounds
 * @property {any} obj
 */

/**
 * @typedef {object} Tree
 * @property {Rect} bounds
 * @property {Array<Element>} elements
 * @property {Tree} tl
 * @property {Tree} tr
 * @property {Tree} bl
 * @property {Tree} br
 */

/**
 * checks if b intersects any half lines of a
 * @param {Rect} a
 * @param {Rect} b
 * @returns {boolean}
 */
function intersectHalfPoints(a, b) {
	return (
		(b.x <= a.x + a.width / 2 && b.x + b.width > a.x + a.width / 2) ||
		(b.y <= a.y + a.height / 2 && b.y + b.height > a.y + a.height / 2)
	);
}

/**
 * checks if a fully encompasses b
 * @param {Rect} a
 * @param {Rect} b
 * @returns {boolean}
 */
function contains(a, b) {
	return (
		a.x <= b.x && a.x + a.width > b.x + b.width && a.y <= b.y && a.y + a.height > b.y + b.height
	);
}

/**
 * checks if a intersects b
 * @param {Rect} a
 * @param {Rect} b
 * @returns {boolean}
 */
function intersects(a, b) {
	let l1 = { x: a.x, y: a.y };
	let l2 = { x: b.x, y: b.y };
	let r1 = { x: a.x + a.width, y: a.y + a.height };
	let r2 = { x: b.x + b.width, y: b.y + b.height };

	// To check if either rectangle is actually a line
	// For example :  l1 ={-1,0}  r1={1,1}  l2={0,-1}  r2={0,1}

	if (l1.x == r1.x || l1.y == r2.y || l2.x == r2.x || l2.y == r2.y) {
		// the line cannot have positive overlap
		return false;
	}

	// If one rectangle is on left side of other
	if (l1.x >= r2.x || l2.x >= r1.x) {
		return false;
	}

	// If one rectangle is above other
	if (l1.y <= r2.y || l2.y <= r1.y) {
		return false;
	}

	return true;
}

/**
 * @param {Rect} rect
 * @returns {Array<number>}
 */
function unwrap(rect) {
	return [rect.x, rect.y, rect.width, rect.height];
}

/**
 * @param {Tree} t
 * @param {Element} element
 */
export function addRect(t, element) {
	if (intersectHalfPoints(t.bounds, element.bounds)) t.elements.push(element);
	else {
		let width = t.bounds.width / 2;
		let height = t.bounds.height / 2;
		let tlBounds = rect(t.bounds.x, t.bounds.y, width, height);
		let trBounds = rect(t.bounds.x + width, t.bounds.y, width, height);
		let blBounds = rect(t.bounds.x, t.bounds.y + height, width, height);
		let brBounds = rect(t.bounds.x + width, t.bounds.y + height, width, height);
		if (contains(tlBounds, element.bounds)) {
			t.tl = addRect(t.tl || tree(...unwrap(tlBounds)), element);
		} else if (contains(trBounds, element.bounds)) {
			t.tr = addRect(t.tr || tree(...unwrap(trBounds)), element);
		} else if (contains(blBounds, element.bounds)) {
			t.bl = addRect(t.bl || tree(...unwrap(blBounds)), element);
		} else if (contains(brBounds, element.bounds)) {
			t.br = addRect(t.br || tree(...unwrap(brBounds)), element);
		}
	}
	console.log(t);
	return t;
}

export function rect(x, y, width, height) {
	return {
		x,
		y,
		width,
		height
	};
}

export function tree(x, y, width, height) {
	return {
		bounds: rect(x, y, width, height),
		elements: []
	};
}

/**
 * @param {Tree} tree
 * @param {Rect} bounds
 * @param {number} depth
 * @returns {Array<Element>}
 */
export function search(tree, bounds, depth = -1) {
	if (!tree || depth === 0) return [];

	let list = tree.elements;

	let width = tree.bounds.width / 2;
	let height = tree.bounds.height / 2;
	let tlBounds = rect(tree.bounds.x, tree.bounds.y, width, height);
	let trBounds = rect(tree.bounds.x + width, tree.bounds.y, width, height);
	let blBounds = rect(tree.bounds.x, tree.bounds.y + height, width, height);
	let brBounds = rect(tree.bounds.x + width, tree.bounds.y + height, width, height);
	if (contains(bounds, tlBounds)) {
		list = list.concat(search(tree.tl, bounds, depth - 1));
	}
	if (contains(bounds, trBounds)) {
		list = list.concat(search(tree.tr, bounds, depth - 1));
	}
	if (contains(bounds, blBounds)) {
		list = list.concat(search(tree.bl, bounds, depth - 1));
	}
	if (contains(bounds, brBounds)) {
		list = list.concat(search(tree.br, bounds, depth - 1));
	}
	return list;
}

export default {
	tree,
	rect,
	addRect,
	search
};
