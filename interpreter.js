function print(args) {
  console.log(args[0]);
}

const env = { print: print };

function run(expr) {
  if (expr.length === 0) {
    // TODO: error in UI
    console.error("Not a valid expression.");
    return;
  }

  const fnName = expr[0];
  const fn = env[fnName];
  if (fn === undefined) {
    // TODO: error in UI
    console.error("No such function: " + fnName);
    return;
  }

  // TODO: evaluate other args
  fn(expr.slice(1));
}

module.exports = { run };
