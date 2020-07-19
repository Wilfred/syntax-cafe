import React, { useState } from "react";

import CodeMirrorTag from "./CodeMirrorTag";
import LexerOptions from "./LexerOptions";
import { buildParser } from "./parsing";
import Result from "./Result";

function sampleProgram(commentPrefix, _trueLiteral, _falseLiteral) {
  return `${commentPrefix} A starter to whet your appetite.
(print "hello world\\n")

${commentPrefix} For the main, a classic fizzbuzz dish.
(set i 1)
(while (lte i 20)
  (do
    (if (equal (mod i 15) 0)
        (print "FizzBuzz\\n")
      (if (equal (mod i 5) 0)
          (print "Buzz\\n")
        (if (equal (mod i 3) 0)
            (print "Fizz\\n")
          (do (print i) (print "\\n")))))
    (set i (add i 1))))`;
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
