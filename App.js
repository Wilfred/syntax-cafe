import React, { useState } from "react";
import Editor from "./Editor";
import LexerOptions from "./LexerOptions";
import Result from "./Result";
import { buildParser } from "./parsing";

const INITIAL_PROGRAM = '; Example\n(print "hello")';

export default function App() {
  const [src, setSrc] = useState(INITIAL_PROGRAM);
  const [commentPrefix, setCommentPrefix] = useState(";");
  const parser = buildParser(commentPrefix);

  const result = parser.Program.parse(src);

  let errorRange = null;
  if (!result.status) {
    const pos = { line: result.index.line - 1, ch: result.index.column - 1 };
    const endPos = { line: result.index.line - 1, ch: result.index.column };

    errorRange = [pos, endPos];
  }

  return (
    <div>
      <LexerOptions
        commentPrefix={commentPrefix}
        setCommentPrefix={setCommentPrefix}
      />
      <Editor
        value={src}
        commentPrefix={commentPrefix}
        onChange={setSrc}
        errorRange={errorRange}
      />
      <Result src={src} parser={parser} />
    </div>
  );
}
