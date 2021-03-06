<script>
	import Toolbar from '$lib/Toolbar.svelte';
	import quadTree from '$lib/quadTree';
	import { onMount } from 'svelte';
	import rough from 'roughjs';
	import colors from '$lib/colors';
	import { drawElement, types } from '$lib/mapRender';
	import { Entity, Farm, House, Marker, Tree } from './entity';
	import Options from './Options.svelte';

	import client from '$lib/client';

	export let tree;
	export let debug = false;
	let canvas;
	let canvasOverlay;

	let tool = types[0];

	/**
	 * @type {import { RoughCanvas } from 'roughjs/bin/canvas'}
	 */
	let rc;
	let ctx;
	let zoom = 100;
	let aspect;
	let camera = { x: 8, y: 8, width: 11, height: 11 };
	onMount(() => {
		ctx = canvas.getContext('2d');
		rc = rough.canvas(canvas);
		resizeCanvas(canvas);
		resizeCanvas(canvasOverlay);

		aspect = canvas.width / canvas.height;
		camera.height = camera.height / aspect;
		window.onresize = () => {
			resizeCanvas(canvas);
			resizeCanvas(canvasOverlay);
		};
		redraw();
	});

	function resizeCanvas(canvas) {
		canvas.height = window.innerHeight;
		canvas.width = window.innerWidth;
		aspect = canvas.width / canvas.height;
		zoom = canvas.width / camera.width;
		redraw();
	}

	/**
	 * @param {Number} num
	 * @returns {Number}
	 */
	function toSingleDecimal(num) {
		return Math.floor(num * 10) / 10;
	}

	/**
	 * @param {import('./quadTree').Tree} tree
	 * @param {CanvasRenderingContext2D} ctx
	 * @param options
	 */
	function drawDebugLines(tree, ctx, options = { zoom: 1 }) {
		ctx.strokeStyle = '#4C566A';

		ctx.font = `2rem 'Indie Flower'`;
		ctx.fillText(
			`(${toSingleDecimal(camera.x)},${toSingleDecimal(camera.y)}), (${toSingleDecimal(
				camera.width
			)},${toSingleDecimal(camera.height)}), (${toSingleDecimal(
				camera.x + camera.width
			)},${toSingleDecimal(camera.y + camera.height)}) ${JSON.stringify({ zoom, aspect })}`,
			25,
			canvas.height - 25
		);
		ctx.strokeRect(
			(tree.bounds.x - camera.x) * options.zoom,
			(tree.bounds.y - camera.y) * options.zoom,
			tree.bounds.width * options.zoom,
			tree.bounds.height * options.zoom
		);

		ctx.strokeStyle = '#E5E9F0';
		ctx.setLineDash([5, 3]); /*dashes are 5px and spaces are 3px*/
		ctx.beginPath();
		ctx.moveTo(
			(tree.bounds.x - camera.x + tree.bounds.width / 2) * options.zoom,
			(tree.bounds.y - camera.y) * options.zoom
		);
		ctx.lineTo(
			(tree.bounds.x - camera.x + tree.bounds.width / 2) * options.zoom,
			(tree.bounds.y - camera.y + tree.bounds.height) * options.zoom
		);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(
			(tree.bounds.x - camera.x) * options.zoom,
			(tree.bounds.y - camera.y + tree.bounds.height / 2) * options.zoom
		);
		ctx.lineTo(
			(tree.bounds.x - camera.x + tree.bounds.width) * options.zoom,
			(tree.bounds.y - camera.y + tree.bounds.height / 2) * options.zoom
		);
		ctx.stroke();
		ctx.setLineDash([]);
		ctx.strokeStyle = '#8FBCBB';
		if (tree.tl) drawDebugLines(tree.tl, ctx, options);
		if (tree.tr) drawDebugLines(tree.tr, ctx, options);
		if (tree.bl) drawDebugLines(tree.bl, ctx, options);
		if (tree.br) drawDebugLines(tree.br, ctx, options);
	}

	/**
	 * @param {import('./quadTree').Tree} tree
	 * @param {CanvasRenderingContext2D} ctx
	 * @param options
	 */
	function drawTree(tree, ctx, options = { zoom: 1 }) {
		if (debug) {
			drawDebugLines(tree, ctx, options);
		}
		let elements = quadTree.search(tree, camera);
		let markers = elements.filter((v) => v.obj.type === Marker.getType());
		elements.forEach((elem) => {
			let b = elem.bounds;
			drawElement(
				{
					obj: elem.obj,
					bounds: { ...b, x: b.x - camera.x, y: b.y - camera.y }
				},
				rc,
				ctx,
				{ ...options, markers }
			);
		});
	}

	function toMapSpace(x, y) {
		return [(x - camera.x * -zoom) / zoom, (y - camera.y * -zoom) / zoom];
	}

	function redraw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawTree(tree, ctx, { zoom, canvas: { width: canvas.width, height: canvas.height } });
	}

	/**
	 * @type {Entity}
	 */
	let current;
	function onClick(e) {
		let mapPoint = toMapSpace(e.offsetX, e.offsetY);
		if (!current) {
			current = new tool();
		}
		let completeTool = current.click(mapPoint[0], mapPoint[1], e.ctrlKey, e.shiftKey, tree);
		if (completeTool) {
			console.log('adding ' + JSON.stringify(completeTool));
			client.pushElement(completeTool);
			current = undefined;
			tree = quadTree.addRect(tree, completeTool);
			redraw();
			canvasOverlay.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
		}
	}

	function onMouseMove(e) {
		let mapPoint = toMapSpace(e.offsetX, e.offsetY);
		if (isSpacePressed) {
			let delta = 1 * (1 / zoom);
			camera.x -= e.movementX * delta;
			camera.y -= e.movementY * delta;
			redraw();
		}
		if (current) {
			current.setMouse(mapPoint[0], mapPoint[1]);
			canvasOverlay.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
			let rc = rough.canvas(canvasOverlay);
			current.render(rc, canvasOverlay.getContext('2d'), { zoom, camera });
		}
	}

	let isSpacePressed = false;
	function keyDown(key) {
		if (key.key === ' ') {
			isSpacePressed = true;
			key.preventDefault();
		}
	}

	function keyUp(key) {
		if (key.key === ' ') isSpacePressed = false;
	}

	function scroll(event) {
		let delta = event.deltaY * 0.1;
		camera.x -= delta;
		camera.y -= delta;
		camera.width += delta * 2;
		camera.height += delta * 2;
		zoom = canvas.width / camera.width;
		redraw();
	}

	function moveCameraToMarker(id) {
		console.log(id);
		console.log(quadTree.search(tree, tree.bounds));
		let marker = quadTree
			.search(tree, tree.bounds)
			.find((e) => e.obj.id === id || e.obj.legend === id);
		if (marker) {
			let start = {
				x: camera.x,
				y: camera.y
			};
			let target = {
				x: marker.bounds.x - camera.width / 2,
				y: marker.bounds.y - camera.height / 2
			};

			const update = (progress) => {
				if (progress > 1) return;
				let p = Math.sin(progress * (Math.PI / 2));
				camera.x = start.x + (target.x - start.x) * p;
				camera.y = start.y + (target.y - start.y) * p;
				redraw();
				setTimeout(() => update((progress += 0.02)), 5);
			};
			update(0);
		} else {
			console.log('marker not found');
		}
	}
</script>

<svelte:window on:keydown={keyDown} on:keyup={keyUp} on:wheel={scroll} />

<pre
	style="position: absolute; right: 1rem; text-align: left">
{JSON.stringify(camera, null, 2)}
</pre>
quadTree

<canvas bind:this={canvas} width="1000" height="1000" style="background-color: {colors.bg};" />

<canvas
	bind:this={canvasOverlay}
	width="1000"
	height="1000"
	on:click={onClick}
	on:mousemove={onMouseMove}
/>
<div class="toolbar">
	<Toolbar onSelect={(s) => (tool = s)} />
</div>

<div class="options">
	<Options bind:tree {moveCameraToMarker} />
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap');
	.toolbar {
		position: absolute;
		top: 1rem;
		left: 1rem;
	}
	.options {
		position: absolute;
		top: 1rem;
		right: 1rem;
	}
	canvas {
		position: absolute;
		top: 0px;
		left: 0px;
	}
</style>
