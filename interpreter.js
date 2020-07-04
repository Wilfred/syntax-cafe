function print(ctx, args) {
  ctx.stdout += args[0];
}

const env = { print };

function runWithContext(ctx, exprs) {
  exprs.forEach(expr => {
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
    fn(ctx, expr.slice(1));
  });
}

function run(exprs) {
  const ctx = { stdout: "" };
  runWithContext(ctx, exprs);

  return ctx;
}

module.exports = { run };
