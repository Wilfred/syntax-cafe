import Parsimmon, { formatError } from "parsimmon";
import React from "react";

const ParseTree: React.FC<{ src: string; result: Parsimmon.Result<any> }> = ({
  src,
  result,
}) => {
  if (result.status) {
    const parseResult = JSON.stringify(result.value, null, "  ");
    return <pre>{parseResult}</pre>;
  } else {
    return (
      <div className="notification is-danger is-light">
        <pre>{formatError(src, result)}</pre>
      </div>
    );
  }
};
export default ParseTree;
