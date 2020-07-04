import React, { useState } from "react";
const LexerOptions = require("./LexerOptions");
const Editor = require("./Editor");
const Result = require("./Result");
const buildParser = require("./parsing").buildParser;

const INITIAL_PROGRAM = '; Example\n(print "hello")';

function App() {
  const [src, setSrc] = useState(INITIAL_PROGRAM);
  const [commentPrefix, setCommentPrefix] = useState(";");
  const parser = buildParser(commentPrefix);

  return (
    <div>
      <LexerOptions
        commentPrefix={commentPrefix}
        setCommentPrefix={setCommentPrefix}
      />
      <Editor value={src} commentPrefix={commentPrefix} onChange={setSrc} />
      <Result src={src} parser={parser} />
    </div>
  );
}

module.exports = App;
