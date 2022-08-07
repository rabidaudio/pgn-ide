import { Chess } from "chess.js"
import { Pgn } from "cm-pgn"

import { writable, derived } from "svelte/store"

// cm-pgn uses 1-indexed line numbers and "offset"/"line"/"column"
// brace uses 0-indexed line numbers and "row"/"column"
function convertPgnLocationToEditorPosition(pgnLocation) {
  let { line, column } = pgnLocation
  return { row: line - 1, column }
}

// return true if a is before b
function isBefore(a, b) {
  return a.row < b.row || (a.row === b.row && a.column < b.column)
}

function getCurrentMove(moves, cursorPosition) {
  if (moves.length === 0) return null

  if (
    isBefore(
      cursorPosition,
      convertPgnLocationToEditorPosition(moves[0].location.start),
    )
  ) {
    return null
  }

  for (let i = 0; i < moves.length; i++) {
    let move = moves[i]
    let position = convertPgnLocationToEditorPosition(move.location.start)
    if (isBefore(cursorPosition, position)) {
      return moves[i - 1]
    }
    if (move.variations.length > 0) {
      const lastVariation = move.variations
        .map((vv) => vv[vv.length - 1])
        .sort((a, b) => a.location.end.offset - b.location.end.offset)[0]
      const lastVariationEnd = convertPgnLocationToEditorPosition(
        lastVariation.location.end,
      )
      let previousVariation
      if (isBefore(cursorPosition, lastVariationEnd)) {
        for (let j = 0; j < move.variations.length; j++) {
          for (let k = 0; k < move.variations[j].length; k++) {
            let variation = move.variations[j][k]
            if (variation) {
              let start = convertPgnLocationToEditorPosition(
                variation.location.start,
              )
              if (isBefore(cursorPosition, start)) {
                if (!previousVariation) {
                  return move
                }
                return previousVariation
              }
              previousVariation = variation
            }
          }
        }
        return lastVariation
      }
    }
  }
  return moves[moves.length - 1]
}

export default class Engine {
  constructor(pgn) {
    this.chess = new Chess()
    // Stores
    this.pgn = writable(pgn || "")
    this.cursorPosition = writable({ row: 0, column: 0 })

    this.parsedPgn = derived(this.pgn, ($pgn) => {
      try {
        return [new Pgn($pgn), null]
      } catch (e) {
        return [null, e]
      }
    })
    this.errors = derived(this.parsedPgn, ([pgn, error]) => error)

    this.currentMove = derived(
      [this.parsedPgn, this.cursorPosition],
      ([[$parsedPgn, $errors], $cursorPosition], set) => {
        if ($parsedPgn && !$errors) set(getCurrentMove($parsedPgn.history.moves, $cursorPosition))
      }
    )

    this.fen = derived(this.currentMove, ($currentMove) => $currentMove ? $currentMove.fen : null)
  }

  movePiece(move) {}
}
