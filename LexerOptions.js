import React from "react";

export default function LexerOptions(props) {
  return (
    <div className="box">
      <h2 className="title">Choose Ingredients 🥚</h2>

      <div className="field">
        <label className="label">Comments</label>
        <div className="control">
          <input
            id="comment"
            className="input"
            type="text"
            placeholder="Comment character"
            value={props.commentPrefix}
            onChange={e => props.setCommentPrefix(e.target.value)}
          />
        </div>
        <p className="help">Prefix character for single line comments</p>
      </div>
    </div>
  );
}
