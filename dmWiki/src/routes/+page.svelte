<script lang="ts">
    import SvelteMarkdown from 'svelte-markdown'
    export let data: any;
</script>

<div class="flex w-full">
    <div class="grid grid-flow-dense grid-rows-3 grid-cols-3 md:grid-rows-6 md:grid-cols-6 gap-3 p-3">
        {#each ((data || {}).cards || []) as card}
        <div class="card row-span-{card.height} col-span-{card.width} bg-base-100 shadow-xl overflow-hidden">
            <div class="card-body">
                <h2 class="card-title">{card.title}</h2>
                <div>
                    <SvelteMarkdown source={card.text}/>
                </div>
            </div>
        </div>
        {/each}
    </div>
    <div class="divider divider-horizontal"></div>
    <div class="grid h-20 flex-grow card rounded-box place-items-center">
        
        <h2 class="font-bold text-lg">News</h2>
        <div class="flex flex-col w-full border-opacity-50">
            {#each ((data || {}).news || []) as news}
            <div class="divider"></div>
                <div class="">{news}</div>
            {/each}
          </div>
    </div>
  </div>
