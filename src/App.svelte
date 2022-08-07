<script>
  import Editor from "./Editor.svelte"
  import Board from "./Board.svelte"

  export let value = ""
  let cursorPosition
</script>

<style>
  .split-container {
    height: 100%;
    display: grid;
    grid-template-columns: 50% 50%;
  }
</style>

<div class="split-container">
  <Editor
    bind:value
    bind:cursorPosition
  />

  <Board />
</div>
