import React, { useState } from "react";
const LexerOptions = require("./LexerOptions");
const Editor = require("./Editor");
const Enjoy = require("./Enjoy");

const INITIAL_PROGRAM = '; Example\n(print "hello")';

function App() {
  const [src, setSrc] = useState(INITIAL_PROGRAM);

  return (
    <div>
      <LexerOptions />
      <Editor value={src} onChange={setSrc} />
      <Enjoy src={src} commentPrefix=";" />
    </div>
  );
}

module.exports = App;
