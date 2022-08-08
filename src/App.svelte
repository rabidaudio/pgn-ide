<script>
  import Engine from "./engine"

  import Editor from "./Editor.svelte"
  import Board from "./Board.svelte"

  export let theme = "monokai" //"chrome"
  const engine = new Engine(window.localStorage.getItem('game') || "")

  const { pgn, fen, errors, cursorPosition } = engine

  $: persistGame($pgn)
  function persistGame(game) {
    window.localStorage.setItem('game', game)
  }
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
    {theme}
  />

  <Board fen={$fen} />
</div>

<!-- <div class="settings">
    <select bind:value={theme}>
      {#each ["clouds_midnight",
      "monokai",
      "tomorrow_night_blue",
      "chrome",
      "github"] as theme }
        <option value={theme}>{theme}</option>
      {/each}  
    </select>
  </div> -->
