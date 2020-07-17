import React, { useState } from "react";

import CodeMirrorTag from "./CodeMirrorTag";
import LexerOptions from "./LexerOptions";
import { buildParser } from "./parsing";
import Result from "./Result";

function sampleProgram(commentPrefix, trueLiteral, falseLiteral) {
  return `${commentPrefix} A starter to whet your appetite.
(print "hello world")

${commentPrefix} For the main, a classic fizzbuzz dish.
(set i 0)
(set underlimit ${trueLiteral})
(while underlimit
  (do
    (print i)
    (print " ")
    (set i (add i 1))
    (set underlimit (lte i 20))))
(print "done")`;
}

export default function App() {
  const [commentPrefix, setCommentPrefix] = useState(";");
  const [trueLiteral, setTrueLiteral] = useState("true");
  const [falseLiteral, setFalseLiteral] = useState("false");

  const [src, setSrc] = useState(
    sampleProgram(commentPrefix, trueLiteral, falseLiteral)
  );

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
      <div className="box">
        <h2 className="title">Write Code 🍳</h2>
        <CodeMirrorTag
          initialValue={sampleProgram(commentPrefix, trueLiteral, falseLiteral)}
          commentPrefix={commentPrefix}
          trueLiteral={trueLiteral}
          falseLiteral={falseLiteral}
          onChange={setSrc}
          errorRange={errorRange}
        />
      </div>
      <Result src={src} parser={parser} />
    </div>
  );
}
