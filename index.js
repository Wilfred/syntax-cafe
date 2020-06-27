const P = require("parsimmon");
const CodeMirror = require("codemirror");

require("codemirror/addon/selection/active-line");
require("codemirror/addon/edit/matchbrackets");
require("codemirror/addon/mode/simple");

const parser = P.createLanguage({
  Program: r =>
    r.Value.sepBy(r._)
      .trim(r._)
      .node("Program"),
  Value: function(r) {
    return P.alt(r.Number, r.Symbol, r.String, r.List);
  },
  Number: function() {
    return P.regexp(/[0-9]+/).map(Number);
  },
  Symbol: function() {
    return P.regexp(/[a-z]+/);
  },
  String: function() {
    return P.regexp(/"((?:\\.|.)*?)"/, 1);
  },
  List: function(r) {
    return P.string("(")
      .then(r._)
      .then(r.Value.sepBy(r._))
      .skip(P.string(")"));
  },
  Comment: () => P.regexp(/\s*;[^\n]*\s*/),
  _: function(r) {
    return P.alt(
      P.seq(P.optWhitespace, r.Comment, P.optWhitespace),
      P.optWhitespace
    );
  }
});

// TODO: recycle from grammar above.
CodeMirror.defineSimpleMode("langplz", {
  start: [
    { regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string" },
    { regex: /;.*/, token: "comment" }
  ]
});

const inputNode = document.getElementById("input");
const editor = CodeMirror.fromTextArea(inputNode, {
  lineNumbers: true,
  styleActiveLine: true,
  matchBrackets: true,
  mode: "langplz",
  theme: "material-palenight"
});

setInterval(() => {
  const s = editor.getValue();
  const result = parser.Program.parse(s);
  if (!result.status) {
    document.getElementById("output").textContent = P.formatError(s, result);
  } else {
    document.getElementById("output").textContent = JSON.stringify(
      result.value,
      null,
      "  "
    );
  }
}, 300);
