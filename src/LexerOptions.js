import React from "react";

import RequiredTextInput from "./RequiredTextInput";

export default function LexerOptions(props) {
  return (
    <div className="box">
      <h2 className="title">Choose Ingredients 🥚</h2>

      <div className="field is-horizontal">
        <label className="field-label">Comment Prefix</label>
        <div className="field-body">
          <RequiredTextInput
            value={props.commentPrefix}
            onChange={props.setCommentPrefix}
            placeholder="E.g. #"
          />
        </div>
      </div>

      <div className="field is-horizontal">
        <label className="field-label">Booleans</label>
        <div className="field-body">
          <div className="field">
            <RequiredTextInput
              value={props.trueLiteral}
              onChange={props.setTrueLiteral}
              placeholder="E.g. true"
            />
          </div>
          <div className="field">
            <RequiredTextInput
              value={props.falseLiteral}
              onChange={props.setFalseLiteral}
              placeholder="E.g. false"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
