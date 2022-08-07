ace.define(
  "ace/mode/pgn_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text_highlight_rules",
  ],
  function (acequire, exports, module) {
    "use strict"

    var oop = acequire("../lib/oop")
    var TextHighlightRules = acequire(
      "./text_highlight_rules",
    ).TextHighlightRules

    // Adapted from https://github.com/jakeboone02/vscode-language-pgn/blob/main/syntaxes/pgn.tmLanguage
    var PgnHighlightRules = function () {
      this.$rules = {
        start: [
          {
            regex: /\[/,
            next: "tag",
            token: "paren.lparen",
          },
        ],
        tag: [
          {
            token: "keyword.control.pgn",
            regex: /(?:Event|Site|Date|Round|White|Black|Result)\b/,
          },
          {
            token: "keyword.other.special-method.pgn",
            regex: /\b([A-Z][a-z]*)+\b/,
          },
          {
            token: "punctuation.definition.string.begin.pgn",
            regex: '"',
            next: "quoted_tag_value",
          },
          {
            regex: /\]/,
            token: "paren.rparen",
            next: "start",
          },
        ],
        quoted_tag_value: [
          {
            token: "constant.character.escape.pgn",
            regex: /\\\\./,
          },
          {
            token: "punctuation.definition.string.end.pgn",
            regex: '"',
            next: "tag",
          },
          { defaultToken: "string.quoted.double.pgn" },
        ],
      }
    }

    oop.inherits(PgnHighlightRules, TextHighlightRules)

    exports.PgnHighlightRules = PgnHighlightRules
  },
)

ace.define(
  "ace/mode/pgn",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text",
    "ace/mode/pgn_highlight_rules",
  ],
  function (acequire, exports, module) {
    "use strict"

    var oop = acequire("../lib/oop")
    var TextMode = acequire("./text").Mode
    var PgnHighlightRules = acequire("./pgn_highlight_rules").PgnHighlightRules

    var Mode = function () {
      this.HighlightRules = PgnHighlightRules
      this.$behaviour = this.$defaultBehaviour
    }
    oop.inherits(Mode, TextMode)
    ;(function () {
      this.blockComment = { start: "{", end: "}" }
      this.$id = "ace/mode/pgn"
    }.call(Mode.prototype))

    exports.Mode = Mode
  },
)
