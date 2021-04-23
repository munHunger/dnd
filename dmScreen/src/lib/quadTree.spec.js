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

	it('map', () => {
		let [x, y] = [335, 333];
		let zoom = 9.44676409185804;
		let [camW, camH] = [11, 11];
		let [cx, cy] = [-34.400000000000006, -34.400000000000006];
		let [cw, ch] = [905, 960];
		let result = [(x / cw) * camW, (y / ch) * zoom + cy];

		console.log(result);
		expect(Math.abs(result[0]) + Math.abs(result[1]) < 2).toBeTruthy();
	});
});
