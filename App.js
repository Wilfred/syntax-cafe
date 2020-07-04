import React, { useState } from "react";
const LexerOptions = require("./LexerOptions");
const Editor = require("./Editor");
const Result = require("./Result");

const INITIAL_PROGRAM = '; Example\n(print "hello")';

function App() {
  const [src, setSrc] = useState(INITIAL_PROGRAM);
  const [commentPrefix, setCommentPrefix] = useState(";");

  return (
    <div>
      <LexerOptions
        commentPrefix={commentPrefix}
        setCommentPrefix={setCommentPrefix}
      />
      <Editor value={src} commentPrefix={commentPrefix} onChange={setSrc} />
      <Result src={src} commentPrefix={commentPrefix} />
    </div>
  );
}

module.exports = App;
