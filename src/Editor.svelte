<script>
  import { onMount, onDestroy } from "svelte"
  import * as ace from "brace"

  import "brace/theme/monokai"
  // TODO: pgn syntax highlighter https://ace.c9.io/#nav=higlighter

  export let value = ""
  export let cursorPosition = { row: 0, column: 0 }
  let contentBackup

  const mode = "text"

  let editor
  let editorElement
  let timer

  $: watchValue(value)
  function watchValue(val) {
    if (contentBackup !== val && editor && typeof val === "string") {
      editor.session.setValue(val)
      contentBackup = val
    }
  }

  onMount(() => {
    editor = ace.edit(editorElement)

    // NOTE: there doesn't seem to be a way to get a callback when cursor position
    // changes. I tried many different callbacks but I couldn't get any of them to
    // work. Instead we poll cursor position.
    timer = setInterval(() => {
      const { row, column } = editor.getCursorPosition()
      if (
        !cursorPosition ||
        row !== cursorPosition.row ||
        column !== cursorPosition.column
      ) {
        cursorPosition = { row, column }
        // console.log(cursorPosition)
      }
    }, 100)

    editor.getSession().setMode("ace/mode/" + mode)
    editor.setTheme("ace/theme/monokai")
    editor.setValue(value, 1)
    editor.on("change", function () {
      const content = editor.getValue()
      value = content
      contentBackup = content
    })
    contentBackup = value
    editor.setOptions({
      wrap: true,
      highlightActiveLine: true,
      highlightSelectedWord: true,
      behavioursEnabled: true,
      wrapBehavioursEnabled: true,
    })
  })

  onDestroy(() => {
    if (editor) {
      editor.destroy()
      editor.container.remove()
    }
    clearInterval(timer)
  })
</script>

<div bind:this={editorElement} />
