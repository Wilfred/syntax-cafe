import React, { useState } from "react";

import CodeMirrorTag from "./CodeMirrorTag";
import LexerOptions from "./LexerOptions";
import { buildParser } from "./parsing";
import { DEFAULT_LANG_OPTS } from "./options";
import Result from "./Result";
import ParseTree from "./ParseTree";
import type { LangOpts } from "./options";

function sampleProgram(opts: LangOpts, blockStyle: string): string {
  if (blockStyle == "curly") {
    return `${opts.commentPrefix} Fancy a lighter meal?
(print ${opts.stringDelimiter}hello world\\n${opts.stringDelimiter})

${opts.commentPrefix} Something a little more filling? How about fizzbuzz, today's special?
(set i 1)
(${opts.whileKeyword} (lte i 20) {
  ${opts.ifKeyword} (equal (mod i 15) 0) {
    (print ${opts.stringDelimiter}FizzBuzz\\n${opts.stringDelimiter})
  } else {
    ${opts.ifKeyword} (equal (mod i 5) 0) {
      (print ${opts.stringDelimiter}Buzz\\n${opts.stringDelimiter})
    } else {
      ${opts.ifKeyword} (equal (mod i 3) 0) {
        (print ${opts.stringDelimiter}Fizz\\n${opts.stringDelimiter})
      } else {
        (print i)
        (print ${opts.stringDelimiter}\\n${opts.stringDelimiter})
      }
    }
  }
  (set i (add i 1))
})

${opts.commentPrefix} Something sweet? We serve a mean quine.
`;
  } else {
    return `${opts.commentPrefix} Fancy a lighter meal?
(print ${opts.stringDelimiter}hello world\\n${opts.stringDelimiter})

${opts.commentPrefix} Something a little more filling? How about fizzbuzz, today's special?
(set i 1)
(${opts.whileKeyword} (lte i 20)
  (do
    (${opts.ifKeyword} (equal (mod i 15) 0)
        (print ${opts.stringDelimiter}FizzBuzz\\n${opts.stringDelimiter})
      (${opts.ifKeyword} (equal (mod i 5) 0)
          (print ${opts.stringDelimiter}Buzz\\n${opts.stringDelimiter})
        (${opts.ifKeyword} (equal (mod i 3) 0)
            (print ${opts.stringDelimiter}Fizz\\n${opts.stringDelimiter})
          (do (print i) (print ${opts.stringDelimiter}\\n${opts.stringDelimiter})))))
    (set i (add i 1))))

${opts.commentPrefix} Something sweet? We serve a mean quine.
`;
  }
}

const App: React.FC = () => {
  const [opts, setOpts] = useState(DEFAULT_LANG_OPTS);

  const [blockStyle, setBlockStyle] = useState("do");
  const [enjoyTab, setEnjoyTab] = useState("source");

  const [src, setSrc] = useState(sampleProgram(opts, blockStyle));

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
              initialValue={sampleProgram(opts, blockStyle)}
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
