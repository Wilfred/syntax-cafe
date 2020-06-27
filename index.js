const P = require("parsimmon");
const CodeMirror = require("codemirror");
const buildParser = require("./parsing").buildParser;

require("codemirror/addon/selection/active-line");
require("codemirror/addon/edit/matchbrackets");
require("codemirror/addon/mode/simple");

const COMMENT_REGEXP = /\s*;[^\n]*\s*/;

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

setInterval(() => {
  let commentPrefixChar = commentNode.value;
  let commentRegexp = new RegExp("\\s*" + commentPrefixChar + "[^\n]*\\s*");

  defineLangplzMode(commentRegexp);
  editor.setOption("mode", "langplz");

  const parser = buildParser(commentRegexp);
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
