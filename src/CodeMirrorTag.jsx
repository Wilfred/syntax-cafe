import "codemirror/addon/selection/active-line";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/mode/simple";

import CodeMirror from "codemirror";
import React from "react";
import { boolLiteralRegexp, commentRegexp, SYMBOL_REGEXP } from "./parsing";
import equal from "fast-deep-equal";

function defineLangplzMode(commentPrefix, trueLiteral, falseLiteral) {
  CodeMirror.defineSimpleMode("langplz", {
    start: [
      { regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string" },
      { regex: commentRegexp(commentPrefix), token: "comment" },
      { regex: boolLiteralRegexp(trueLiteral), token: "atom" },
      { regex: boolLiteralRegexp(falseLiteral), token: "atom" },
      { regex: /(?:if|while|set)\b/, token: "keyword" },
      { regex: SYMBOL_REGEXP, token: "variable" }
    ]
  });
}

// Wraps a textarea with a CodeMirror attached. I tried the library
// react-codemirror2, but we need precise control of modes defined.
export default class CodeMirrorTag extends React.Component {
  constructor(props) {
    super(props);
    this.textArea = React.createRef();
    this.editor = null;
    this.marker = null;
  }
  componentDidMount() {
    defineLangplzMode(
      this.props.commentPrefix,
      this.props.trueLiteral,
      this.props.falseLiteral
    );
    this.editor = CodeMirror.fromTextArea(this.textArea.current, {
      lineNumbers: true,
      matchBrackets: true,
      styleActiveLine: true,
      mode: "langplz"
    });
    this.editor.on("change", () => {
      this.props.onChange(this.editor.getValue());
    });
    this.setMarker(this.props.errorRange);
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.commentPrefix != this.props.commentPrefix ||
      prevProps.trueLiteral != this.props.trueLiteral ||
      prevProps.falseLiteral != this.props.falseLiteral
    ) {
      defineLangplzMode(
        this.props.commentPrefix,
        this.props.trueLiteral,
        this.props.falseLiteral
      );
      this.editor.setOption("mode", "langplz");
    }
    if (!equal(prevProps.errorRange, this.props.errorRange)) {
      this.setMarker(this.props.errorRange);
    }

    // Update the contents if the initial value changes and the user
    // hasn't modified it.
    if (
      prevProps.initialValue != this.props.initialValue &&
      this.editor.getValue() == prevProps.initialValue
    ) {
      this.editor.setValue(this.props.initialValue);
    }
  }
  setMarker(errorRange) {
    if (this.marker !== null) {
      this.marker.clear();
      this.marker = null;
    }
    if (errorRange !== null) {
      this.marker = this.editor.markText(errorRange[0], errorRange[1], {
        className: "syntax-error",
        title: "foo",
        css: "border-bottom: 2px dotted red;"
      });
    }
  }
  render() {
    return (
      <textarea ref={this.textArea} defaultValue={this.props.initialValue} />
    );
  }
}
