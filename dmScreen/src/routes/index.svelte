<script>
	import quadTree from '$lib/quadTree.js';
	import QuadTree from '$lib/QuadTree.svelte';

	let tree = quadTree.tree(0, 0, 10, 10);
	for (let i = 0; i < 10; i++) {
		let x = Math.random() * 10;
		let y = Math.random() * 10;
		let width = Math.random() * (10 - x);
		let height = Math.random() * (10 - y);
		quadTree.addRect(tree, {
			bounds: quadTree.rect(x, y, width, height),
			obj: { type: Math.random() > 0.5 ? 'house' : 'tree' }
		});
	}
</script>

<main>
	<QuadTree {tree} debug={false}/>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}
</style>
