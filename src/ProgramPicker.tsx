import React from "react";

const ProgramPicker: React.FC<{ setItem: (_: string) => void }> = ({
  setItem,
}) => {
  return (
    <div>
      <h2>
        <a
          onClick={(_: any) => {
            setItem("helloworld");
          }}
        >
          Hello, World!
        </a>
      </h2>
      <p>Foo.</p>

      <h2>
        <a
          onClick={(_: any) => {
            setItem("fizzbuzz");
          }}
        >
          FizzBuzz
        </a>
      </h2>
      <p>Foo.</p>

      <h2>
        <a
          onClick={(_: any) => {
            setItem("quine");
          }}
        >
          Quine
        </a>
      </h2>
      <p>Foo.</p>
    </div>
  );
};
export default ProgramPicker;
