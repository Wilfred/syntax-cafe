import React from "react";

export default function LexerOptions(props) {
  return (
    <div className="box">
      <h2 className="title">Choose Ingredients 🥚</h2>

      <div className="field is-horizontal">
        <label className="field-label">Comment Prefix</label>
        <div className="field-body">
          <input
            className="input"
            type="text"
            placeholder="E.g. #"
            value={props.commentPrefix}
            onChange={e => props.setCommentPrefix(e.target.value)}
          />
        </div>
      </div>

      <div className="field is-horizontal">
        <label className="field-label">Booleans</label>
        <div className="field-body">
          <div className="field">
            <input
              className="input"
              type="text"
              placeholder="E.g. true"
              value={props.trueLiteral}
              onChange={e => props.setTrueLiteral(e.target.value)}
            />
          </div>
          <div className="field">
            <input
              className="input"
              type="text"
              placeholder="E.g. false"
              value={props.falseLiteral}
              onChange={e => props.setFalseLiteral(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
