<script>
  import Editor from "./Editor.svelte";
  import "brace/theme/monokai";
  // TODO: pgn syntax highlighter https://ace.c9.io/#nav=higlighter

  export let value = "";
  export let cursorPosition;

  $: console.log(cursorPosition);
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
    theme="monokai"
    options={{
      wrap: true,
      highlightActiveLine: true,
      highlightSelectedWord: true,
      behavioursEnabled: true,
      wrapBehavioursEnabled: true,
    }}
    bind:value
    bind:cursorPosition
  />

  <div />
</div>
