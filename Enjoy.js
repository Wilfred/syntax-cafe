import React from "react";

function Enjoy() {
  return (
    <div className="box">
      <h2 className="title">Enjoy 🍽️</h2>

      <button id="run" className="button">
        Run It
      </button>
      <pre id="output">stdout here</pre>
      <pre id="ast-output">Syntax Tree here</pre>
    </div>
  );
}

module.exports = Enjoy;
