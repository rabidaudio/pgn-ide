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
      const includeVariation = (baseToken) =>
        function (match, state, stack) {
          if (state === "start") return baseToken
          return [state, baseToken].join(".")
        }

      this.$rules = {
        start: [
          { include: "#tag" },
          { include: "#moves" },
          {
            regex: /\b(?:1-0|0-1|1\/2-1\/2)\n?$/,
            token: "string.quoted.double.pgn",
          },
        ],
        "#tag": [
          {
            regex: /\[/,
            token: "paren.lparen",
            push: [
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
                regex: /\"/,
                push: [
                  {
                    token: "constant.character.escape.pgn",
                    regex: /\\\\./,
                  },
                  {
                    token: "punctuation.definition.string.end.pgn",
                    regex: /\"/,
                    next: "pop",
                  },
                  { defaultToken: "string.quoted.double.pgn" },
                ],
              },
              {
                regex: /\]/,
                token: "paren.rparen",
                next: "pop",
              },
            ],
          },
        ],
        "#moves": [
          {
            regex: /\b[0-9]+\.\.?\.?/,
            onMatch: includeVariation("storage.type.bold.pgn"),
          },
          {
            regex: /\b(?:[KQBNR]?[a-h]?[0-9]?x?[a-h][0-9]\+?\#?|O-O|O-O-O)/,
            onMatch: includeVariation("markup.san.pgn"),
          },
          {
            regex:
              /(?:\$[0-9]+|!!|\?\?|!\?|\?!|!|\?|‼|⁇|⁉|⁈|□|=|∞|⩲|⩱|±|∓|\+-|-\+|⨀|⟳|→|↑|⇆|D)/,
            onMatch: includeVariation("keyword.operator.pgn"),
          },
          { include: "#variation" },
          { include: "#comment" },
        ],
        "#comment": [
          {
            regex: /\{/,
            token: "comment.block.documentation.pgn",
            push: [
              {
                token: "comment.block.documentation.pgn",
                regex: /\}/,
                next: "pop",
              },
              { defaultToken: "comment.block.documentation.pgn" },
            ],
          },
        ],
        "#variation": [
          {
            token: "markup.italic.pgn",
            regex: /\(/,
            push: [
              {
                token: "markup.italic.pgn",
                regex: /\)/,
                next: "pop",
              },
              { include: "#moves" },
            ],
          },
        ],
      }
      this.normalizeRules()
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
