import { Chess } from "chess.js"
import { Pgn } from "cm-pgn"

import { writable, derived } from "svelte/store"

const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

class SyntaxError extends Error {
  constructor(cause) {
    super(cause.message)
    this.cause = cause
  }

  annotation() {
    return {
      type: "error",
      ...convertPgnLocationToEditorPosition(this.cause.location.start),
      text: this.message,
    }
  }

  marker() {
    return {
      start: convertPgnLocationToEditorPosition(this.cause.location.start),
      end: convertPgnLocationToEditorPosition(this.cause.location.end),
      class: "ace_invalid",
      type: "text",
      inFront: true,
    }
  }
}

class IllegalMoveError extends Error {
  constructor(san, location) {
    super(`Illegal Move: ${san}`)
    this.location = location
  }

  annotation() {
    return {
      type: "error",
      ...convertPgnLocationToEditorPosition(this.location.start),
      text: this.message,
    }
  }

  marker() {
    return {
      start: convertPgnLocationToEditorPosition(this.location.start),
      end: convertPgnLocationToEditorPosition(this.location.end),
      class: "ace_invalid",
      type: "text",
      inFront: true,
    }
  }
}

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
    // Stores
    this.pgn = writable(pgn || "")
    this.cursorPosition = writable({ row: 0, column: 0 })

    const parsedPgn = derived(this.pgn, ($pgn) => {
      try {
        return [new Pgn($pgn), []]
      } catch (e) {
        switch (e.constructor.name) {
          case "peg$SyntaxError":
            return [null, [new SyntaxError(e)]]
          case "IllegalMoveException":
            return [null, [new IllegalMoveError(e.notation, e.location)]]
          default:
            throw e
        }
      }
    })

    const currentMove = derived(
      [parsedPgn, this.cursorPosition],
      ([[$parsedPgn, $parseErrors], $cursorPosition], set) => {
        if ($parsedPgn && $parseErrors.length === 0) {
          set(getCurrentMove($parsedPgn.history.moves, $cursorPosition))
        } else {
          set(null)
        }
      },
    )

    const chess = derived(
      [parsedPgn, currentMove],
      ([[$parsedPgn, $parseErrors], $currentMove], set) => {
        if ($parsedPgn && $parseErrors.length === 0 && $currentMove) {
          const fen = $parsedPgn.header.tags["FEN"] || DEFAULT_FEN
          const chess = new Chess(fen)
          for (const move of $parsedPgn.history.moves) {
            if (!chess.move(move.san)) {
              throw new IllegalMoveError(move.san, move.location) // this shouldn't happen as the parser already allowed the move
            }
          }
          set(chess)
        }
      },
    )

    this.errors = derived(parsedPgn, ([_, $parseErrors]) => $parseErrors || [])
    this.fen = derived(chess, ($chess) => {
      return $chess ? $chess.fen() : DEFAULT_FEN
    })
  }

  movePiece(move) {}
}
