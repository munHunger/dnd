<script>
	import rough from 'roughjs';
	import { onMount } from 'svelte';
    import {drawElement, types} from "$lib/mapRender"
    import colors from '$lib/colors';

    export let onSelect;

    let canvas = [];

    let selected = types[0]

    onMount(() => {
        types.forEach((type, i) => {
            drawElement({
                bounds: {
                    x: 0.25,
                    y: 0.25,
                    width: 0.5,
                    height: 0.5
                },
                obj: {
                    type
                }
            }, rough.canvas(canvas[i]), {zoom: 50})
        })
    })
</script>
<div class="bar">
    {#each types as type, i}
        <div class="item" on:click={() => {
            selected = type;
            if(onSelect)
                onSelect(type)
            }}>
            <canvas bind:this={canvas[i]} height=50 width=50 style="background-color: {type === selected ? colors.light: '#ffffff00'}" />
        </div>
    {/each}
</div>

<style>
    .item {
        cursor: pointer;
    }
    .bar {
        background-color: white;
        padding: 0.5rem;
        border-radius: 0.25rem;
        box-shadow: 0rem 0rem 1rem 0.2rem rgba(0,0,0,0.2);
    }
</style>