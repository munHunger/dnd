<script>
	import quadTree from '$lib/quadTree';
	import { onMount } from 'svelte';
	import rough from 'roughjs';
	export let tree;
	export let debug = false;
	let canvas;
	let rc;
    let ctx;
	let zoom = 50;
	onMount(() => {
		ctx = canvas.getContext('2d');
		rc = rough.canvas(canvas);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        zoom = canvas.width / tree.bounds.width
		drawTree(tree, ctx, { zoom });
	});
	/**
	 * @param {import('./quadTree').Tree} tree
	 * @param {CanvasRenderingContext2D} ctx
	 * @param options
	 */
	function drawTree(tree, ctx, options = { zoom: 1 }) {
		if (debug) {
			ctx.strokeStyle = '#4C566A';
			ctx.strokeRect(
				tree.bounds.x * options.zoom,
				tree.bounds.y * options.zoom,
				tree.bounds.width * options.zoom,
				tree.bounds.height * options.zoom
			);

			ctx.strokeStyle = '#E5E9F0';
			ctx.setLineDash([5, 3]); /*dashes are 5px and spaces are 3px*/
			ctx.beginPath();
			ctx.moveTo(
				(tree.bounds.x + tree.bounds.width / 2) * options.zoom,
				tree.bounds.y * options.zoom
			);
			ctx.lineTo(
				(tree.bounds.x + tree.bounds.width / 2) * options.zoom,
				(tree.bounds.y + tree.bounds.height) * options.zoom
			);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(
				tree.bounds.x * options.zoom,
				(tree.bounds.y + tree.bounds.height / 2) * options.zoom
			);
			ctx.lineTo(
				(tree.bounds.x + tree.bounds.width) * options.zoom,
				(tree.bounds.y + tree.bounds.height / 2) * options.zoom
			);
			ctx.stroke();
			ctx.setLineDash([]);
			ctx.strokeStyle = '#8FBCBB';
		}
		tree.elements.forEach((elem) => {
			if (elem.obj.type === 'house')
				rc.rectangle(
					elem.bounds.x * options.zoom,
					elem.bounds.y * options.zoom,
					elem.bounds.width * options.zoom,
					elem.bounds.height * options.zoom,
					{
						fill: '#81A1C1',
						fillStyle: 'zigzag',
						fillStyle: 'solid',
						fillWeight: 8,
						hachureGap: 10,
						roughness: 2
					}
				);

			if (elem.obj.type === 'tree')
				rc.ellipse(
					elem.bounds.x * options.zoom,
					elem.bounds.y * options.zoom,
					elem.bounds.width * options.zoom,
					elem.bounds.height * options.zoom,
					{
						fill: '#88C0D0',
						fillStyle: 'solid',
						roughness: 6
					}
				);
		});

		if (tree.tl) drawTree(tree.tl, ctx, options);
		if (tree.tr) drawTree(tree.tr, ctx, options);
		if (tree.bl) drawTree(tree.bl, ctx, options);
		if (tree.br) drawTree(tree.br, ctx, options);
	}

	function onClick(e) {
		let bounds = quadTree.rect(
			(e.offsetX / 1000) * tree.bounds.width,
			(e.offsetY / 1000) * tree.bounds.height,
			0.5,
		    0.5
		);
        console.log(bounds)
        let old = JSON.stringify(tree)
		tree = quadTree.addRect(tree, {
			bounds,
			obj: { type: 'house' }
		});
        ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawTree(tree, ctx, {zoom});
		console.log(tree);
        console.log(JSON.stringify(tree) === old)
	}
</script>

{tree}
quadTree

<canvas bind:this={canvas} width="1000" height="1000" style="background-color: #f0f9ff;" on:click={onClick} />
