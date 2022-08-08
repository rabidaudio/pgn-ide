<script>
  import { onMount, onDestroy } from "svelte"
  import * as ace from "brace"

  import "brace/theme/clouds_midnight"
  import "brace/theme/monokai"
  import "brace/theme/tomorrow_night_blue"
  import "brace/theme/chrome"
  import "brace/theme/github"

  import "./grammar/pgn"

  const Range = ace.acequire("ace/range").Range

  export let value = ""
  export let cursorPosition = { row: 0, column: 0 }
  export let errors = []
  export let theme = "monokai"
  let contentBackup

  let editor
  let editorElement
  let timer
  let errorMarkers = []

  $: watchValue(value)
  function watchValue(val) {
    if (contentBackup !== val && editor && typeof val === "string") {
      editor.session.setValue(val)
      contentBackup = val
    }
  }

  $: watchTheme(theme)
  function watchTheme(newTheme) {
    if (editor) {
      console.log("setTheme", newTheme)
      editor.setTheme(`ace/theme/${newTheme}`)
    }
  }

  $: watchErrors(errors)
  function watchErrors(newErrors) {
    if (editor) {
      editor.session.clearAnnotations()
      for (const markerId of errorMarkers) {
        editor.session.removeMarker(markerId)
      }
      editor.session.setAnnotations(newErrors.map((e) => e.annotation()))
      errorMarkers = newErrors.map((e) => {
        const { start, end, clazz, type, inFront } = e.marker()
        const range = new Range(start.row, start.column, end.row, end.column)
        return editor.session.addMarker(range, clazz, type, inFront)
      })
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
      }
    }, 100)

    editor.getSession().setMode("ace/mode/pgn")
    editor.setTheme(`ace/theme/${theme}`)
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
