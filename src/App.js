import React, { useState } from "react";

import Editor from "./Editor";
import LexerOptions from "./LexerOptions";
import { buildParser } from "./parsing";
import Result from "./Result";

export default function App() {
  const [commentPrefix, setCommentPrefix] = useState(";");
  const sampleProgram = `${commentPrefix} A starter to whet your appetite.
(print "hello world")

${commentPrefix} For the main, a classic fizzbuzz dish.`;
  const [src, setSrc] = useState(sampleProgram);
  const [trueLiteral, setTrueLiteral] = useState("true");
  const [falseLiteral, setFalseLiteral] = useState("false");

  const parser = buildParser(commentPrefix, trueLiteral, falseLiteral);

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
        trueLiteral={trueLiteral}
        setTrueLiteral={setTrueLiteral}
        falseLiteral={falseLiteral}
        setFalseLiteral={setFalseLiteral}
      />
      <Editor
        value={sampleProgram}
        commentPrefix={commentPrefix}
        trueLiteral={trueLiteral}
        falseLiteral={falseLiteral}
        onChange={setSrc}
        errorRange={errorRange}
      />
      <Result src={src} parser={parser} />
    </div>
  );
}
