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
		(b.x <= a.x + a.width / 2 && b.x + b.width >= a.x + a.width / 2) ||
		(b.y <= a.y + a.height / 2 && b.y + b.height >= a.y + a.height / 2)
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
 * @param {Rect} rect
 * @param {Object} point
 * @param {number} point.x
 * @param {number} point.y
 * @returns {boolean}
 */
function containsPoint(rect, point) {
	return (
		point.x >= rect.x &&
		point.x <= rect.x + rect.width &&
		point.y >= rect.y &&
		point.y <= rect.y + rect.height
	);
}

/**
 * checks if a intersects b
 * @param {Rect} a
 * @param {Rect} b
 * @returns {boolean}
 */
function intersects(a, b) {
	let l2 = { x: b.x, y: b.y };
	let r2 = { x: b.x + b.width, y: b.y + b.height };

	return containsPoint(a, l2) || containsPoint(a, r2);
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
	console.log('addRect');
	if (!contains(t.bounds, element.bounds)) {
		console.log('need new parent');
		let newParent;
		//need to create new parent
		if (t.bounds.x + t.bounds.width < element.bounds.x + element.bounds.width) {
			if (t.bounds.y + t.bounds.height < element.bounds.y + element.bounds.height) {
				newParent = tree(t.bounds.x, t.bounds.y, t.bounds.width * 2, t.bounds.height * 2);
				newParent.tl = t;
			} else {
				newParent = tree(
					t.bounds.x,
					t.bounds.y - t.bounds.height,
					t.bounds.width * 2,
					t.bounds.height * 2
				);
				newParent.bl = t;
			}
		} else {
			if (t.bounds.y + t.bounds.height < element.bounds.y + element.bounds.height) {
				newParent = tree(
					t.bounds.x - t.bounds.width,
					t.bounds.y,
					t.bounds.width * 2,
					t.bounds.height * 2
				);
				newParent.tr = t;
			} else {
				newParent = tree(
					t.bounds.x - t.bounds.width,
					t.bounds.y - t.bounds.height,
					t.bounds.width * 2,
					t.bounds.height * 2
				);
				newParent.br = t;
			}
		}
		console.log('new parent created, inserting element to new root');
		return addRect(newParent, element);
	}
	if (intersectHalfPoints(t.bounds, element.bounds)) {
		console.log('pushing element to current');
		t.elements.push(element);
	} else {
		console.log('could not insert to current, searching for suitable child');
		let width = t.bounds.width / 2;
		let height = t.bounds.height / 2;
		let tlBounds = rect(t.bounds.x, t.bounds.y, width, height);
		let trBounds = rect(t.bounds.x + width, t.bounds.y, width, height);
		let blBounds = rect(t.bounds.x, t.bounds.y + height, width, height);
		let brBounds = rect(t.bounds.x + width, t.bounds.y + height, width, height);
		console.log(element.bounds);
		console.log(t.bounds);
		console.log([tlBounds, trBounds, blBounds, brBounds]);
		if (contains(tlBounds, element.bounds)) {
			console.log('inserting to tl');
			t.tl = addRect(t.tl || tree(...unwrap(tlBounds)), element);
		} else if (contains(trBounds, element.bounds)) {
			console.log('inserting to tr');
			t.tr = addRect(t.tr || tree(...unwrap(trBounds)), element);
		} else if (contains(blBounds, element.bounds)) {
			console.log('inserting to bl');
			t.bl = addRect(t.bl || tree(...unwrap(blBounds)), element);
		} else if (contains(brBounds, element.bounds)) {
			console.log('inserting to br');
			t.br = addRect(t.br || tree(...unwrap(brBounds)), element);
		}
	}
	console.log('returning');
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
	if (intersects(bounds, tlBounds)) {
		list = list.concat(search(tree.tl, bounds, depth - 1));
	}
	if (intersects(bounds, trBounds)) {
		list = list.concat(search(tree.tr, bounds, depth - 1));
	}
	if (intersects(bounds, blBounds)) {
		list = list.concat(search(tree.bl, bounds, depth - 1));
	}
	if (intersects(bounds, brBounds)) {
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
