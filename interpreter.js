const _ = require("lodash");

function print(ctx, args) {
  if (ctx.stdout === null) {
    ctx.stdout = "";
  }

  ctx.stdout += args[0];
}

const env = { print };

function runWithContext(ctx, exprs) {
  _.forEach(exprs, expr => {
    if (expr.length === 0) {
      ctx.error = "Not a valid expression.";
      return false;
    }

    const fnName = expr[0];
    const fn = env[fnName];
    if (fn === undefined) {
      ctx.error = "No such function: " + fnName;
      return false;
    }

    // TODO: evaluate other args
    fn(ctx, expr.slice(1));
  });
}

function run(exprs) {
  const ctx = { stdout: null, error: null };
  runWithContext(ctx, exprs);

  return ctx;
}

module.exports = { run };
