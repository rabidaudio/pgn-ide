<script>
  import { onMount, onDestroy } from "svelte"

  import { Chessground } from "chessground"

  export let fen = null

  let ground
  let outerContainer
  let container

  function rerender(fen) {
    if (ground) ground.destroy()
    ground = Chessground(container, {
      fen: fen,
      events: {
        move: (orig, dest, capturedPiece) => {
          console.log("move", orig, dest, capturedPiece)
        },
      },
    })
  }

  function resize() {
    // seems to work best with an integer multiple of 8
    let dim = Math.min(
      outerContainer.offsetWidth - 10,
      outerContainer.offsetHeight - 20,
    )
    dim = dim - (dim % 8)
    const px = `${dim}px`
    container.style.width = px
    container.style.height = px
  }

  $: if (container) rerender(fen)
  $: if (container && outerContainer) resize()

  onMount(() => {
    rerender(fen)
    resize()
  })

  onDestroy(() => {
    ground.destroy()
  })
</script>

<svelte:window on:resize={resize} />
<div class="board blue merida" bind:this={outerContainer}>
  <div bind:this={container} />
</div>
