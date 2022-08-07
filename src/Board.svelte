<script>
  import { onMount, onDestroy } from "svelte"

  import { Chessground } from "chessground"

  export let fen = null

  let ground
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

  $: if (container) rerender(fen)

  onMount(() => {
    rerender(fen)
  })

  onDestroy(() => {
    ground.destroy()
  })
</script>

<!-- TODO: autoscale -->
<div class="blue merida">
  <div class="cg-wrap">
    <div bind:this={container} />
  </div>
</div>
