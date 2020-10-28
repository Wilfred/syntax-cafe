import React, { useState } from "react";

import CodeMirrorTag from "./CodeMirrorTag";
import ProgramPicker from "./ProgramPicker";
import LexerOptions from "./LexerOptions";
import { buildParser } from "./parsing";
import { helloworld, fizzbuzz, quine } from "./sample-programs";
import { DEFAULT_LANG_OPTS } from "./options";
import Result from "./Result";

const App: React.FC = () => {
  const [opts, setOpts] = useState(DEFAULT_LANG_OPTS);

  const [activeTab, setActiveTab] = useState("menu");

  const [menuItem, setMenuItem] = useState("helloworld");

  const [src, setSrc] = useState(helloworld(opts));

  const parser = buildParser(opts);
  const result = parser.Program.parse(src);

  let errorRange = null;
  if (!result.status) {
    const pos = { line: result.index.line - 1, ch: result.index.column - 1 };
    const endPos = { line: result.index.line - 1, ch: result.index.column };

    errorRange = [pos, endPos];
  }

  let initialCode;
  if (menuItem == "helloworld") {
    initialCode = helloworld(opts);
  } else if (menuItem == "fizzbuzz") {
    initialCode = fizzbuzz(opts);
  } else {
    initialCode = quine(opts);
  }

  let tab;
  if (activeTab == "menu") {
    tab = <ProgramPicker setItem={setMenuItem} />;
  } else if (activeTab == "about") {
    tab = (
      <div>
        For full recipes, check out{" "}
        <a href="https://github.com/Wilfred/syntax-cafe/">
          this project on GitHub
        </a>
        .
      </div>
    );
  } else {
    tab = <LexerOptions opts={opts} setOpts={setOpts} />;
  }

  return (
    <div>
      <div className="tabs is-boxed">
        <ul>
          <li className={activeTab == "menu" ? "is-active" : ""}>
            <a onClick={() => setActiveTab("menu")}>
              <span>📃 Menu</span>
            </a>
          </li>
          <li className={activeTab == "special" ? "is-active" : ""}>
            <a onClick={() => setActiveTab("special")}>
              <span>🌶️ Special Requests</span>
            </a>
          </li>
          <li className={activeTab == "about" ? "is-active" : ""}>
            <a onClick={() => setActiveTab("about")}>
              <span>🔪 About</span>
            </a>
          </li>
        </ul>
      </div>
      {tab}

      {activeTab != "about" ? (
        <div className="">
          <CodeMirrorTag
            initialValue={initialCode}
            options={opts}
            onChange={setSrc}
            errorRange={errorRange}
          />
          <Result src={src} parser={parser} opts={opts} />
        </div>
      ) : null}
    </div>
  );
};
export default App;
