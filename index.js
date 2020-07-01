const P = require("parsimmon");
const CodeMirror = require("codemirror");
const escape = require("regexp.escape");
const buildParser = require("./parsing").buildParser;

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
  let commentRegexp = getCommentRegexp();

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
    let pos = { line: result.index.line - 1, ch: result.index.column - 1 };
    let endPos = { line: result.index.line - 1, ch: result.index.column };

    const m = editor.markText(pos, endPos, {
      className: "syntax-error",
      title: "foo",
      css: "border-bottom: 1px dotted red;"
    });
    markers.push(m);

    document.getElementById("output").textContent = P.formatError(s, result);
  } else {
    document.getElementById("output").textContent = JSON.stringify(
      result.value,
      null,
      "  "
    );
  }
}, 300);
