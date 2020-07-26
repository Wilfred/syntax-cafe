import React, { useState } from "react";

import CodeMirrorTag from "./CodeMirrorTag";
import LexerOptions from "./LexerOptions";
import { buildParser } from "./parsing";
import { DEFAULT_LANG_OPTS } from "./options";
import Result from "./Result";
import ParseTree from "./ParseTree";

function sampleProgram(
  commentPrefix: string,
  whileKeyword: string,
  ifKeyword: string,
  blockStyle: string
): string {
  if (blockStyle == "curly") {
    return `${commentPrefix} A starter to whet your appetite.
(print "hello world\\n")

${commentPrefix} For the main, a classic fizzbuzz dish.
(set i 1)
(${whileKeyword} (lte i 20) {
  ${ifKeyword} (equal (mod i 15) 0) {
    (print "FizzBuzz\\n")
  } else {
    ${ifKeyword} (equal (mod i 5) 0) {
      (print "Buzz\\n")
    } else {
      ${ifKeyword} (equal (mod i 3) 0) {
        (print "Fizz\\n")
      } else {
        (print i)
        (print "\\n")
      }
    }
  }
  (set i (add i 1))
})`;
  } else {
    return `${commentPrefix} A starter to whet your appetite.
(print "hello world\\n")

${commentPrefix} For the main, a classic fizzbuzz dish.
(set i 1)
(${whileKeyword} (lte i 20)
  (do
    (${ifKeyword} (equal (mod i 15) 0)
        (print "FizzBuzz\\n")
      (${ifKeyword} (equal (mod i 5) 0)
          (print "Buzz\\n")
        (${ifKeyword} (equal (mod i 3) 0)
            (print "Fizz\\n")
          (do (print i) (print "\\n")))))
    (set i (add i 1))))`;
  }
}

const App: React.FC = () => {
  const [opts, setOpts] = useState(DEFAULT_LANG_OPTS);

  const [blockStyle, setBlockStyle] = useState("do");
  const [enjoyTab, setEnjoyTab] = useState("source");

  const [src, setSrc] = useState(
    sampleProgram(
      opts.commentPrefix,
      opts.whileKeyword,
      opts.ifKeyword,
      blockStyle
    )
  );

  const parser = buildParser(opts, blockStyle);
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
        opts={opts}
        setOpts={setOpts}
        blockStyle={blockStyle}
        setBlockStyle={setBlockStyle}
      />
      <div className="box">
        <h2 className="title">Enjoy 🍽️</h2>
        <div className="tabs">
          <ul>
            <li className={enjoyTab == "source" ? "is-active" : ""}>
              <a onClick={() => setEnjoyTab("source")}>Source</a>
            </li>
            <li className={enjoyTab == "parse-tree" ? "is-active" : ""}>
              <a onClick={() => setEnjoyTab("parse-tree")}>
                Parse Tree {result.status ? "🌹" : "🥀"}
              </a>
            </li>
          </ul>
        </div>

        {enjoyTab == "source" ? (
          <>
            <CodeMirrorTag
              initialValue={sampleProgram(
                opts.commentPrefix,
                opts.whileKeyword,
                opts.ifKeyword,
                blockStyle
              )}
              options={opts}
              onChange={setSrc}
              errorRange={errorRange}
            />
            <Result src={src} parser={parser} />
          </>
        ) : (
          <ParseTree src={src} result={result} />
        )}
      </div>
    </div>
  );
};
export default App;
