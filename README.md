Split-screen editor for PGN

Annotate games with syntax highlighting and visualization.

TODO:

- board moves update editor
- create variations on board
- move animations - apply and roll back moves instead of redrawing fen
- tab complete move numbers and legal moves - https://github.com/thlorenz/brace/blob/master/ext/language_tools.js
- shortcuts for Annotation symbols
- Control-f support https://github.com/thlorenz/brace/blob/master/ext/searchbox.js
- save multiple games to storage, share games with others
- list moves, e.g. https://www.npmjs.com/package/lichess-pgn-viewer
- show top engine moves
- pick themes
- spellcheck https://github.com/thlorenz/brace/blob/master/ext/spellcheck.js


```
  / '!!' { return '$3'; }
  / '??' { return '$4'; }
  / '!?' { return '$5'; }
  / '?!' { return '$6'; }
  / '!' { return '$1'; }
  / '?' { return '$2'; }
  / '‼' { return '$3'; }
  / '⁇' { return '$4'; }
  / '⁉' { return '$5'; }
  / '⁈' { return '$6'; }
  / '□' { return '$7'; }
  / '=' { return '$10'; }
  / '∞' { return '$13'; }
  / '⩲' { return '$14'; }
  / '⩱' { return '$15';}
  / '±' { return '$16';}
  / '∓' { return '$17';}
  / '+-' { return '$18';}
  / '-+' { return '$19';}
  / '⨀' { return '$22'; }
  / '⟳' { return '$32'; }
  / '→' { return '$36'; }
  / '↑' { return '$40'; }
  / '⇆' { return '$132'; }
  / 'D' { return '$220'; }
```


https://github.com/rabidaudio/cm-pgn/tree/move-locations
https://www.npmjs.com/package/chess.js
https://github.com/lichess-org/chessground/blob/master/src/state.ts
https://github.com/lichess-org/chessground/blob/master/src/api.ts
https://github.com/thlorenz/brace/blob/master/theme/monokai.js
https://ace.c9.io/