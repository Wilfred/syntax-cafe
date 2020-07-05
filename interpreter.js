import _ from "lodash";

function print(ctx, args) {
  if (ctx.stdout === null) {
    ctx.stdout = "";
  }

  ctx.stdout += args[0].value;
}

const env = { print };

function runWithContext(ctx, exprs) {
  _.forEach(exprs, expr => {
    if (expr.value.length === 0) {
      ctx.error = "Not a valid expression.";
      return false;
    }

    // TODO: check it's a symbol.
    const fnName = expr.value[0].value;
    const fn = env[fnName];
    if (fn === undefined) {
      ctx.error = "No such function: " + fnName;
      return false;
    }

    // TODO: evaluate other args
    fn(ctx, expr.value.slice(1));
  });
}

export function run(exprs) {
  const ctx = { stdout: null, error: null };
  runWithContext(ctx, exprs);

  return ctx;
}
