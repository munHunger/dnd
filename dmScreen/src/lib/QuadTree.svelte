<script>
	import quadTree from '$lib/quadTree';
	import { onMount } from 'svelte';
	import rough from 'roughjs';
	export let tree;
	export let debug = false;
	let canvas;
	let canvasOverlay;
	/**
	 * @type {import { RoughCanvas } from 'roughjs/bin/canvas'}
	 */
	let rc;
	let ctx;
	let zoom = 50;
	onMount(() => {
		ctx = canvas.getContext('2d');
		rc = rough.canvas(canvas);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		zoom = canvas.width / tree.bounds.width;
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
			drawElement(elem, rc, options)
		});

		if (tree.tl) drawTree(tree.tl, ctx, options);
		if (tree.tr) drawTree(tree.tr, ctx, options);
		if (tree.bl) drawTree(tree.bl, ctx, options);
		if (tree.br) drawTree(tree.br, ctx, options);
	}

	function drawElement(elem, rc, options) {
		let rotation = elem.obj.rotation || 0;
		console.log("rendering with rotation " + rotation);
		let x = elem.bounds.x * options.zoom;
		let y = elem.bounds.y * options.zoom;
		let width = elem.bounds.width * options.zoom;
		let height = elem.bounds.height * options.zoom;
		let x2 = x + width;
		let y2 = y + height;
		let origin = {x,y}
		if (elem.obj.type === 'house') {
			let points = [origin, {x:x2, y}, {x:x2,y:y2}, {x, y:y2}]
				.map(p => rotatePoint(origin, p, rotation))
				.map(p => `${p.x} ${p.y}`)
				.join(" ");
			console.log(origin)
			console.log(points)
			rc.path(`M${x} ${y} L ${points} Z`,
				{
					fill: '#81A1C1',
					fillStyle: 'zigzag',
					//fillStyle: 'solid',
					fillWeight: 8,
					hachureGap: 10,
					roughness: 1
				}
			);
		}
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
	}

	function rotatePoint(origin, point, angle){
		return {x: Math.cos(angle) * (point.x - origin.x) - Math.sin(angle) * (point.y - origin.y) + origin.x,
				y: Math.sin(angle) * (point.x - origin.x) + Math.cos(angle) * (point.y - origin.y) + origin.y};
	}

	function toMapSpace(x, y) {
		return [(x / 1000) * tree.bounds.width, (y / 1000) * tree.bounds.height];
	}

	/**
	 * @type {import('$lib/quadTree').Element}
	 */
	let elem;
	let clickState = 0;

	function onClick(e) {
		clickState = (clickState + 1) % 3;
		let mapPoint = toMapSpace(e.offsetX, e.offsetY);
		if(clickState === 1)
			elem = {obj: {type: 'house'}, bounds: {x: mapPoint[0], y: mapPoint[1], width: 10, height: 10}}

		let old = JSON.stringify(tree);
		if (clickState === 0) {
			tree = quadTree.addRect(tree, elem);
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			drawTree(tree, ctx, { zoom });
			console.log(tree);
			console.log(JSON.stringify(tree) === old);
			canvasOverlay.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
		}
	}

	function onMouseMove(e) {
		let mapPoint = toMapSpace(e.offsetX, e.offsetY);
		if(elem) {
			if (clickState === 1) {
				elem.bounds.width = mapPoint[0] - elem.bounds.x;
				elem.bounds.height = mapPoint[1] - elem.bounds.y;
			}
			if(clickState === 2){
				elem.obj.rotation = elem.bounds.x - mapPoint[0];
				console.log("set rotation to " + elem.obj.rotation)
			}
			if(clickState !== 0) {
				canvasOverlay.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
				drawElement(elem, rough.canvas(canvasOverlay), {zoom})
			}
		}
	}

</script>

{tree}
quadTree

<canvas bind:this={canvas} width="1000" height="1000" style="background-color: #f0f9ff;" />

<canvas
	bind:this={canvasOverlay}
	width="1000"
	height="1000"
	on:click={onClick}
	on:mousemove={onMouseMove}
/>

<style>
	canvas {
		position: absolute;
		top: 0px;
		left: 0px;
	}
</style>
