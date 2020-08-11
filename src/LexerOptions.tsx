import React from "react";

import type { LangOpts } from "./options";
import RequiredTextInput from "./RequiredTextInput";

function validSymbolPattern(s: string): boolean {
  if (s == "") {
    return false;
  }

  try {
    new RegExp(s);
    return true;
  } catch (_) {
    return false;
  }
}

const LexerOptions: React.FC<{
  opts: LangOpts;
  setOpts: (_: LangOpts) => void;
  blockStyle: string;
  setBlockStyle: (_: string) => void;
}> = ({ opts, setOpts, blockStyle, setBlockStyle }) => {
  return (
    <div className="box">
      <h2 className="title">Menu 📃</h2>

      <div className="tabs">
        <ul>
          <li>
            <a>Set Menu 🍲</a>
          </li>
          <li className="is-active">
            <a>à la carte 🌶️</a>
          </li>
        </ul>
      </div>

      <div className="field is-horizontal">
        <label className="field-label">Comment Prefix</label>
        <div className="field-body">
          <RequiredTextInput
            value={opts.commentPrefix}
            onChange={(s: string) => setOpts(opts.set("commentPrefix", s))}
            placeholder="E.g. #"
          />
        </div>
      </div>

      <div className="field is-horizontal">
        <label className="field-label">Boolean Literals</label>
        <div className="field-body">
          <div className="field">
            <RequiredTextInput
              value={opts.trueKeyword}
              onChange={(s: string) => setOpts(opts.set("trueKeyword", s))}
              placeholder="E.g. true"
            />
          </div>
          <div className="field">
            <RequiredTextInput
              value={opts.falseKeyword}
              onChange={(s: string) => setOpts(opts.set("falseKeyword", s))}
              placeholder="E.g. false"
            />
          </div>
        </div>
      </div>

      <div className="field is-horizontal">
        <label className="field-label">String Literals</label>
        <div className="field-body">
          <RequiredTextInput
            value={opts.stringDelimiter}
            onChange={(s: string) => setOpts(opts.set("stringDelimiter", s))}
            placeholder="E.g. '"
          />
        </div>
      </div>

      <div className="field is-horizontal">
        <label className="field-label">Symbols</label>
        <div className="field-body">
          <RequiredTextInput
            validator={validSymbolPattern}
            value={opts.symbolRegexp.source}
            onChange={(s: string) =>
              setOpts(opts.set("symbolRegexp", new RegExp(s)))
            }
            placeholder="E.g. '"
          />
        </div>
      </div>

      <div className="field is-horizontal">
        <label className="field-label">Blocks</label>
        <div className="field-body">
          <select
            value={blockStyle}
            onChange={(e) => setBlockStyle(e.target.value)}
          >
            <option value="do">(do ... )</option>
            <option value="curly">{"{ ... }"}</option>
          </select>
          <div className="field">
            <RequiredTextInput
              value={opts.whileKeyword}
              onChange={(s: string) => setOpts(opts.set("whileKeyword", s))}
              placeholder="E.g. while"
            />
          </div>
          <div className="field">
            <RequiredTextInput
              value={opts.ifKeyword}
              onChange={(s: string) => setOpts(opts.set("ifKeyword", s))}
              placeholder="E.g. if"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default LexerOptions;
