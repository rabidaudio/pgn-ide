import { Chess } from "chess.js"
import { Pgn } from "cm-pgn"

import { writable, derived } from "svelte/store"

// cm-pgn uses 1-indexed line numbers and "offset"/"line"/"column"
// brace uses 0-indexed line numbers and "row"/"column"
export function convertPgnLocationToEditorPosition(pgnLocation) {
  let { line, column } = pgnLocation
  return { row: line - 1, column }
}

// return true if a is before b
function isBefore(a, b) {
  return a.row < b.row || (a.row === b.row && a.column < b.column)
}

export default class Engine {
  constructor(pgn) {
    this.chess = new Chess()
    // Stores
    this.pgn = writable(pgn || "")
    this.cursorPosition = writable({ row: 0, column: 0 })

    this.parsedPgn = derived(this.pgn, ($pgn) => new Pgn($pgn))

    this.currentMove = derived(
      [this.parsedPgn, this.cursorPosition],
      ([$parsedPgn, $cursorPosition]) => {
        if ($parsedPgn.history.moves.length === 0) return null

        const firstMove = $parsedPgn.history.moves[0]
        const firstMoveStart = convertPgnLocationToEditorPosition(
          firstMove.location.start,
        )
        if (isBefore($cursorPosition, firstMoveStart)) return firstMove

        for (let i = 0; i < $parsedPgn.history.moves.length; i++) {
          let move = $parsedPgn.history.moves[i]
          let position = convertPgnLocationToEditorPosition(move.location.start)
          if (isBefore($cursorPosition, position)) {
            return $parsedPgn.history.moves[i - 1]
          }
        }
        return $parsedPgn.history.moves[$parsedPgn.history.moves.length - 1]
      },
    )

    this.fen = derived(this.currentMove, ($currentMove) => {
      return $currentMove.fen
    })
    this.errors = writable([])
  }

  movePiece(move) {}
}
