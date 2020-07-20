import React from "react";

import RequiredTextInput from "./RequiredTextInput";

const LexerOptions: React.FC<{
  commentPrefix: string;
  setCommentPrefix: (_: string) => void;
  trueLiteral: string;
  setTrueLiteral: (_: string) => void;
  falseLiteral: string;
  setFalseLiteral: (_: string) => void;
  blockStyle: string;
  setBlockStyle: (_: string) => void;
}> = ({
  commentPrefix,
  setCommentPrefix,
  trueLiteral,
  setTrueLiteral,
  falseLiteral,
  setFalseLiteral,
  blockStyle,
  setBlockStyle,
}) => {
  return (
    <div className="box">
      <h2 className="title">Choose Ingredients 🥚</h2>

      <div className="field is-horizontal">
        <label className="field-label">Comment Prefix</label>
        <div className="field-body">
          <RequiredTextInput
            value={commentPrefix}
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
              value={trueLiteral}
              onChange={setTrueLiteral}
              placeholder="E.g. true"
            />
          </div>
          <div className="field">
            <RequiredTextInput
              value={falseLiteral}
              onChange={setFalseLiteral}
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
          </select>{" "}
        </div>
      </div>
    </div>
  );
};
export default LexerOptions;
