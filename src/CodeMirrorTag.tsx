import "codemirror/addon/selection/active-line";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/mode/simple";

import CodeMirror from "codemirror";
import equal from "fast-deep-equal";
import React from "react";

import { commentRegexp, SYMBOL_REGEXP, wordRegexp } from "./parsing";

function defineLangplzMode(
  commentPrefix: string,
  trueKeyword: string,
  falseKeyword: string,
  whileKeyword: string
): void {
  CodeMirror.defineSimpleMode("langplz", {
    start: [
      { regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string" },
      { regex: commentRegexp(commentPrefix), token: "comment" },
      { regex: wordRegexp(trueKeyword), token: "atom" },
      { regex: wordRegexp(falseKeyword), token: "atom" },
      { regex: wordRegexp(whileKeyword), token: "keyword" },
      { regex: /(?:if|set)\b/, token: "keyword" },
      { regex: SYMBOL_REGEXP, token: "variable" },
    ],
  });
}

type Position = {
  line: number;
  ch: number;
};

type Props = {
  initialValue: string;
  commentPrefix: string;
  trueKeyword: string;
  falseKeyword: string;
  whileKeyword: string;
  onChange: (_: string) => void;
  errorRange: Array<Position> | null;
};

// Wraps a textarea with a CodeMirror attached. I tried the library
// react-codemirror2, but we need precise control of modes defined.
export default class CodeMirrorTag extends React.Component<Props> {
  textArea: React.RefObject<any>;
  editor: CodeMirror.EditorFromTextArea | null;
  marker: CodeMirror.TextMarker | null;
  constructor(props: Props) {
    super(props);
    this.textArea = React.createRef();
    this.editor = null;
    this.marker = null;
  }
  componentDidMount() {
    defineLangplzMode(
      this.props.commentPrefix,
      this.props.trueKeyword,
      this.props.falseKeyword,
      this.props.whileKeyword
    );
    const editor = CodeMirror.fromTextArea(this.textArea.current, {
      lineNumbers: true,
      matchBrackets: true,
      styleActiveLine: true,
      mode: "langplz",
    });
    editor.on("change", () => {
      this.props.onChange(editor.getValue());
    });
    this.editor = editor;
    this.setMarker(this.props.errorRange);
  }
  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.commentPrefix != this.props.commentPrefix ||
      prevProps.trueKeyword != this.props.trueKeyword ||
      prevProps.falseKeyword != this.props.falseKeyword ||
      prevProps.whileKeyword != this.props.whileKeyword
    ) {
      if (this.editor !== null) {
        defineLangplzMode(
          this.props.commentPrefix,
          this.props.trueKeyword,
          this.props.falseKeyword,
          this.props.whileKeyword
        );
        this.editor.setOption("mode", "langplz");
      }
    }
    if (!equal(prevProps.errorRange, this.props.errorRange)) {
      this.setMarker(this.props.errorRange);
    }

    // Update the contents if the initial value changes and the user
    // hasn't modified it.
    if (
      prevProps.initialValue != this.props.initialValue &&
      this.editor !== null &&
      this.editor.getValue() == prevProps.initialValue
    ) {
      this.editor.setValue(this.props.initialValue);
    }
  }
  setMarker(errorRange: any) {
    if (this.marker !== null) {
      this.marker.clear();
      this.marker = null;
    }
    if (this.editor !== null && errorRange !== null) {
      this.marker = this.editor.markText(errorRange[0], errorRange[1], {
        className: "syntax-error",
        title: "foo",
        css: "border-bottom: 2px dotted red;",
      });
    }
  }
  render() {
    return (
      <textarea ref={this.textArea} defaultValue={this.props.initialValue} />
    );
  }
}
