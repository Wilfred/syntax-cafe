import "codemirror/addon/selection/active-line";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/mode/simple";

import CodeMirror from "codemirror";
import equal from "fast-deep-equal";
import React from "react";

import type { LangOpts } from "./options";
import { commentRegexp, wordRegexp, stringLiteralRegexp } from "./parsing";

function defineLangplzMode(opts: LangOpts): void {
  let rules = [
    { regex: stringLiteralRegexp(opts.stringDelimiter), token: "string" },
    { regex: commentRegexp(opts.commentPrefix), token: "comment" },
    { regex: wordRegexp(opts.trueKeyword), token: "atom" },
    { regex: wordRegexp(opts.falseKeyword), token: "atom" },
    { regex: wordRegexp(opts.whileKeyword), token: "keyword" },
    { regex: wordRegexp(opts.ifKeyword), token: "keyword" },
    { regex: opts.symbolRegexp, token: "variable" },
  ];
  if (opts.statementTerminator === null) {
    const exprKeywords = [
      { regex: wordRegexp("set"), token: "keyword" },
      { regex: wordRegexp("do"), token: "keyword" },
    ];
    // Ensure that the symbol regexp is always last.
    rules = exprKeywords.concat(rules);
  } else {
    const stmtKeywords = [{ regex: wordRegexp("else"), token: "keyword" }];
    rules = stmtKeywords.concat(rules);
  }

  CodeMirror.defineSimpleMode("langplz", {
    start: rules,
  });
}

type Position = {
  line: number;
  ch: number;
};

type Props = {
  initialValue: string;
  options: LangOpts;
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
    defineLangplzMode(this.props.options);
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
  componentWillUnmount() {
    this.editor?.toTextArea();
    this.editor = null;
  }
  componentDidUpdate(prevProps: Props) {
    if (!prevProps.options.equals(this.props.options)) {
      if (this.editor !== null) {
        defineLangplzMode(this.props.options);
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
  setMarker(errorRange: Array<Position> | null) {
    if (this.marker !== null) {
      this.marker.clear();
      this.marker = null;
    }
    if (this.editor !== null && errorRange !== null) {
      this.marker = this.editor.markText(errorRange[0], errorRange[1], {
        className: "syntax-error",
        // TODO: Make this more specific
        title: "Syntax Error",
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
