import React from "react";

const ProgramPicker: React.FC<{ setItem: (_: string) => void }> = ({
  setItem,
}) => {
  return (
    <div>
      <div className="menu-item">
        <h2>
          <a
            onClick={(_: any) => {
              setItem("helloworld");
            }}
          >
            Hello, World!
          </a>
        </h2>
        <p>A light introduction to Syntax Café.</p>
      </div>

      <div className="menu-item">
        <h2>
          <a
            onClick={(_: any) => {
              setItem("fizzbuzz");
            }}
          >
            FizzBuzz
          </a>
        </h2>
        <p>A drinking problem? An interview exercise? You be the judge.</p>
      </div>

      <div className="menu-item">
        <h2>
          <a
            onClick={(_: any) => {
              setItem("quine");
            }}
          >
            Quine
          </a>
        </h2>
        <p>
          A program that prints it own source code. Not as easy as it sounds.
        </p>
      </div>
    </div>
  );
};
export default ProgramPicker;
