import React from "react";
import ReactDOM from "react-dom";
const P = require("parsimmon");
const CodeMirror = require("codemirror");
const escape = require("regexp.escape");
const buildParser = require("./parsing").buildParser;
const run = require("./interpreter").run;
const LexerOptions = require("./LexerOptions");
const Editor = require("./Editor");
const Enjoy = require("./Enjoy");

require("codemirror/addon/selection/active-line");
require("codemirror/addon/edit/matchbrackets");
require("codemirror/addon/mode/simple");

function defineLangplzMode(commentRegexp) {
  CodeMirror.defineSimpleMode("langplz", {
    start: [
      { regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string" },
      { regex: commentRegexp, token: "comment" }
    ]
  });
}

const App = document.getElementById("app");

ReactDOM.render(
  <div>
    <LexerOptions />
    <Editor />
    <Enjoy src="(foo bar)" commentPrefix=";" />
  </div>,
  App
);

const inputNode = document.getElementById("input");
const commentNode = document.getElementById("comment");

const editor = CodeMirror.fromTextArea(inputNode, {
  lineNumbers: true,
  styleActiveLine: true,
  matchBrackets: true,
  theme: "material-palenight"
});

function getCommentRegexp() {
  const commentPrefixChar = commentNode.value;
  return new RegExp("\\s*" + escape(commentPrefixChar) + "[^\n]*\\s*");
}

let markers = [];

setInterval(() => {
  const commentRegexp = getCommentRegexp();

  defineLangplzMode(commentRegexp);
  editor.setOption("mode", "langplz");

  const parser = buildParser(commentRegexp);
  const s = editor.getValue();
  const result = parser.Program.parse(s);

  markers.forEach(m => {
    m.clear();
  });
  markers = [];

  if (!result.status) {
    const pos = { line: result.index.line - 1, ch: result.index.column - 1 };
    const endPos = { line: result.index.line - 1, ch: result.index.column };

    const m = editor.markText(pos, endPos, {
      className: "syntax-error",
      title: "foo",
      css: "border-bottom: 1px dotted red;"
    });
    markers.push(m);

    document.getElementById("ast-output").textContent = P.formatError(
      s,
      result
    );
  } else {
    document.getElementById("ast-output").textContent = JSON.stringify(
      result.value,
      null,
      "  "
    );
  }
}, 300);

const runBtn = document.getElementById("run");
runBtn.onclick = function() {
  const parser = buildParser(getCommentRegexp());
  const s = editor.getValue();
  const result = parser.Program.parse(s);

  run(result.value.value);
};
