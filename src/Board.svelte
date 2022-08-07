<script>
  import { onMount, onDestroy } from "svelte"

  import { Chessground } from "chessground"

  let ground
  let container

  onMount(() => {
    ground = Chessground(container, {
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
      events: {
        move: (orig, dest, capturedPiece) => {
          console.log('move', orig, dest, capturedPiece)
        }
      }
    })
    console.log(container, ground)
  })
</script>

<!-- TODO: autoscale -->
<div class="blue merida">
  <div class="cg-wrap">
    <div bind:this={container} />
  </div>
</div>
