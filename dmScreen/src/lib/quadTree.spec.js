import quadTree from './quadTree.js';

function toMapSpace(x, y) {
	return [(x / canvas.width) * zoom + camera.x, (y / canvas.height) * camera.height + camera.y];
}

describe('Quadtree', function () {
	it('insert and fetch on root', function () {
		var q = quadTree.tree(0, 0, 10, 10);
		quadTree.addRect(q, { bounds: quadTree.rect(4, 4, 2, 2), obj: 'hello world' });
		expect(quadTree.search(q, quadTree.rect(0, 0, 10, 10))[0].obj).toBe('hello world');
	});
});
