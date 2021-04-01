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
    return a.x <= b.x && a.x + a.width > b.x + b.width && a.y <= b.y && a.y + a.height > b.y + b.height;
}

/**
 * @param {Rect} rect 
 * @returns {Array<number>}
 */
function unwrap(rect) {
    return [rect.x, rect.y, rect.width, rect.height]
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
        let tlBounds = rect(t.bounds.x, t.bounds.y, width, height)
        let trBounds = rect(t.bounds.x + width, t.bounds.y, width, height)
        let blBounds = rect(t.bounds.x, t.bounds.y + height, width, height)
        let brBounds = rect(t.bounds.x + width, t.bounds.y + height, width, height)
        if(contains(tlBounds, element.bounds)) {
            t.tl = addRect((t.tl || tree(...unwrap(tlBounds))), element);
        }
        else if(contains(trBounds, element.bounds)) {
            t.tr = addRect((t.tr || tree(...unwrap(trBounds))), element);
        }
        else if(contains(blBounds, element.bounds)) {
            t.bl = addRect((t.bl || tree(...unwrap(blBounds))), element);
        }
        else if(contains(brBounds, element.bounds)) {
            t.br = addRect((t.br || tree(...unwrap(brBounds))), element);
        }
    }
    console.log(t)
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

export default {
	tree,
	rect,
	addRect
};
