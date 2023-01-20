<script lang="ts">
    let data = [
        {
            title: "lorem ipsum",
            text: "dolor sit amet",
            width: 2,
            height: 1
        },
        {
            title: "lorem ipsum",
            text: "dolor sit amet",
            width: 1,
            height: 2
        }
    ]
</script>

<div class="flex w-full">
    <div class="grid grid-flow-dense grid-rows-6 grid-cols-6 gap-3 p-3">
        {#each data as card}
        <div class="card row-span-{card.height} col-span-{card.width}  bg-base-100 shadow-xl overflow-hidden">
            <div class="card-body">
                <h2 class="card-title">{card.title}</h2>
                <p>{card.text}</p>
            </div>
        </div>
        {/each}
    </div>
    <div class="divider divider-horizontal"></div>
    <div class="grid h-20 flex-grow card bg-base-300 rounded-box place-items-center">
        sidebar
    </div>
  </div>
