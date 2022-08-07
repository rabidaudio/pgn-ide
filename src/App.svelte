<script>
  import Engine from "./engine"

  import Editor from "./Editor.svelte"
  import Board from "./Board.svelte"

  export let value = ""
  const engine = new Engine(value)

  const { pgn, fen, errors, cursorPosition } = engine
</script>

<style>
  .split-container {
    height: 100%;
    display: grid;
    grid-template-columns: 50% 50%;
  }

  @media only screen and (orientation: portrait) {
    .split-container {
      grid-template-columns: 100%;
      grid-template-rows: 50% 50%;
    }
    :global(.board) {
      order: -1;
    }
  }
</style>

<div class="split-container">
  <Editor
    bind:value={$pgn}
    bind:cursorPosition={$cursorPosition}
    errors={$errors}
  />

  <Board fen={$fen} />
</div>
