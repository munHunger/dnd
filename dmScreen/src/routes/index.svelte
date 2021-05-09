<script context="module">
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, fetch, session, context }) {
		let campaign = page.query.get('campaign');
		let url = `/index.json`;
		if (campaign) url += `?campaign=${campaign}`;
		const res = await fetch(url);

		if (res.ok) {
			let data = await res.json();
			return {
				props: {
					campaign: data
				}
			};
		}

		return {
			status: res.status,
			error: new Error(`Could not load ${url}`)
		};
	}
</script>

<script>
	import quadTree from '$lib/quadTree.js';
	import QuadTree from '$lib/QuadTree.svelte';

	export let campaign;
	import { onMount } from 'svelte';
	onMount(() => {
		console.log('hello');
	});
</script>

<main>
	<QuadTree tree={campaign.tree} debug={false} />
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}
</style>
