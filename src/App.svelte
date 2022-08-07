<script>
  import Engine from "./engine"

  import Editor from "./Editor.svelte"
  import Board from "./Board.svelte"

  export let value = ""
  const engine = new Engine(value)

  const { pgn, fen, errors, parsedPgn, currentMove, cursorPosition } = engine

  $: console.log($currentMove.san)
</script>

<style>
  .split-container {
    height: 100%;
    display: grid;
    grid-template-columns: 50% 50%;
  }
</style>

<div class="split-container">
  <Editor bind:value={$pgn} bind:cursorPosition={$cursorPosition} />

  <Board fen={$fen} />
</div>
