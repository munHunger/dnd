<script>
	export let tree;

	export let moveCameraToMarker;

	function save() {
		window.localStorage.setItem('tree', JSON.stringify(tree));
	}

	function load() {
		tree = JSON.parse(window.localStorage.getItem('tree'));
	}

	function goTo() {
		let id = window.prompt('id', '1');
		moveCameraToMarker(id);
	}
</script>

<div class="bar">
	<!-- <div on:click={save}>save</div>
	<div on:click={load}>load</div> -->
	<div on:click={goTo}>goto</div>
</div>

<style>
	.bar {
		cursor: pointer;
		background-color: white;
		padding: 0.5rem;
		border-radius: 0.25rem;
		box-shadow: 0rem 0rem 1rem 0.2rem rgba(0, 0, 0, 0.2);
	}
</style>
