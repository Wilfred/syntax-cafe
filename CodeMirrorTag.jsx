import React from "react";
const commentRegexp = require("./parsing").commentRegexp;
const CodeMirror = require("codemirror");

require("codemirror/addon/selection/active-line");
require("codemirror/addon/edit/matchbrackets");
require("codemirror/addon/mode/simple");

function defineLangplzMode(commentPrefix) {
  CodeMirror.defineSimpleMode("langplz", {
    start: [
      { regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string" },
      { regex: commentRegexp(commentPrefix), token: "comment" }
    ]
  });
}

// Wraps a textarea with a CodeMirror attached. I tried the library
// react-codemirror2, but we need precise control of modes defined.
class CodeMirrorTag extends React.Component {
  constructor(props) {
    super(props);
    this.textArea = React.createRef();
    this.editor = null;
  }
  componentDidMount() {
    defineLangplzMode(this.props.commentPrefix);
    this.editor = CodeMirror.fromTextArea(this.textArea.current, {
      lineNumbers: true,
      matchBrackets: true,
      styleActiveLine: true,
      mode: "langplz"
    });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.commentPrefix != this.props.commentPrefix) {
      defineLangplzMode(this.props.commentPrefix);
      this.editor.setOption("mode", "langplz");
    }
  }
  render() {
    return (
      <textarea ref={this.textArea} defaultValue={this.props.initialValue} />
    );
  }
}

module.exports = CodeMirrorTag;
