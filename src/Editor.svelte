<script>
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import * as ace from "brace";

  export let value = "";
  let contentBackup;
  export let theme = "monokai";
  export let mode = "text";
  export let options = {};

  export let cursorPosition;

  const dispatch = createEventDispatcher();

  let editor;
  let editorElement;
  let timer;

  $: watchValue(value);
  function watchValue(val) {
    if (contentBackup !== val && editor && typeof val === "string") {
      editor.session.setValue(val);
      contentBackup = val;
    }
  }

  $: watchTheme(theme);
  function watchTheme(newTheme) {
    if (editor) {
      editor.setTheme("ace/theme/" + newTheme);
    }
  }

  $: watchMode(mode);
  function watchMode(newOption) {
    if (editor) {
      editor.getSession().setMode("ace/mode/" + newOption);
    }
  }

  $: watchOptions(options);
  function watchOptions(newOption) {
    if (editor) {
      console.log("setOptions", newOption);
      editor.setOptions(newOption);
    }
  }

  onMount(() => {
    editor = ace.edit(editorElement);

    // NOTE: there doesn't seem to be a way to get a callback when cursor position
    // changes. I tried many different callbacks but I couldn't get any of them to
    // work. Instead we poll cursor position.
    timer = setInterval(() => {
      const { row, column } = editor.getCursorPosition();
      if (
        !cursorPosition ||
        row !== cursorPosition.row ||
        column !== cursorPosition.column
      ) {
        cursorPosition = { row, column };
      }
    }, 100);

    editor.getSession().setMode("ace/mode/" + mode);
    editor.setTheme("ace/theme/" + theme);
    editor.setValue(value, 1);
    editor.on("change", function () {
      const content = editor.getValue();
      value = content;
      dispatch("input", content);
      contentBackup = content;
    });
    contentBackup = value;
    if (options) {
      editor.setOptions(options);
    }
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
      editor.container.remove();
    }
    clearInterval(timer);
  });
</script>

<div bind:this={editorElement} />
