import React from "react";

import type { LangOpts } from "./options";
import RequiredTextInput from "./RequiredTextInput";

const LexerOptions: React.FC<{
  opts: LangOpts;
  setCommentPrefix: (_: string) => void;
  setTrueKeyword: (_: string) => void;
  setFalseKeyword: (_: string) => void;
  blockStyle: string;
  setBlockStyle: (_: string) => void;
  whileKeyword: string;
  setWhileKeyword: (_: string) => void;
}> = ({
  opts,
  setCommentPrefix,
  setTrueKeyword,
  setFalseKeyword,
  blockStyle,
  setBlockStyle,
  whileKeyword,
  setWhileKeyword,
}) => {
  return (
    <div className="box">
      <h2 className="title">Choose Ingredients 🥚</h2>

      <div className="field is-horizontal">
        <label className="field-label">Comment Prefix</label>
        <div className="field-body">
          <RequiredTextInput
            value={opts.commentPrefix}
            onChange={setCommentPrefix}
            placeholder="E.g. #"
          />
        </div>
      </div>

      <div className="field is-horizontal">
        <label className="field-label">Booleans</label>
        <div className="field-body">
          <div className="field">
            <RequiredTextInput
              value={opts.trueKeyword}
              onChange={setTrueKeyword}
              placeholder="E.g. true"
            />
          </div>
          <div className="field">
            <RequiredTextInput
              value={opts.falseKeyword}
              onChange={setFalseKeyword}
              placeholder="E.g. false"
            />
          </div>
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
              value={whileKeyword}
              onChange={setWhileKeyword}
              placeholder="E.g. while"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default LexerOptions;
