import _ from "lodash";

function print(ctx, args) {
  if (ctx.stdout === null) {
    ctx.stdout = "";
  }

  // TODO: Check arity.
  ctx.stdout += args[0].value;
  return null;
}

function add(ctx, args) {
  if (ctx.stdout === null) {
    ctx.stdout = "";
  }

  const total = { value: 0, name: "NumberLiteral" };
  // TODO: check values are numbers.
  args.forEach(arg => {
    total.value += arg.value;
  });

  return total;
}

const env = { print, add };

function error(ctx, msg) {
  ctx.error = msg;
  console.error(msg);
}

function evalExpr(ctx, expr) {
  // TODO: evaluate number literals, bool literals, symbols.
  if (expr.name == "StringLiteral") {
    return expr;
  }
  if (expr.name == "NumberLiteral") {
    return expr;
  }

  if (expr.name !== "List") {
    error(ctx, "Expected a list, but got: " + expr.name);
    return null;
  }

  if (expr.value.length === 0) {
    error(ctx, "Not a valid expression.");
    return null;
  }

  // TODO: check fnName is a symbol.
  const fnName = expr.value[0].value;
  const fn = env[fnName];
  if (fn === undefined) {
    error(ctx, "No such function: " + fnName);
    return null;
  }

  const rawArgs = expr.value.slice(1);
  const args = rawArgs.map(rawArg => evalExpr(ctx, rawArg));

  return fn(ctx, args);
}
function evalExprs(ctx, exprs) {
  let result = null;

  _.forEach(exprs, expr => {
    result = evalExpr(ctx, expr);

    if (ctx.error) {
      return false;
    }
  });

  return result;
}

export function run(exprs) {
  const ctx = { stdout: null, error: null };
  evalExprs(ctx, exprs);

  return ctx;
}
