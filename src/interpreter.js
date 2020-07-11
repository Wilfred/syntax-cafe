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

  const total = { value: 0, name: "Number" };
  // TODO: check values are numbers.
  args.forEach(arg => {
    total.value += arg.value;
  });

  return total;
}

function error(ctx, msg) {
  ctx.error = msg;
  /* eslint-env node */
  if (process.env.NODE_ENV != "test") {
    console.error(msg);
  }
}

function evalExpr(ctx, expr) {
  if (expr.name == "String") {
    return expr;
  }
  if (expr.name == "Number") {
    return expr;
  }
  if (expr.name == "Bool") {
    return expr;
  }
  if (expr.name == "Symbol") {
    const symName = expr.value;
    const symVal = ctx.env[symName];
    if (symVal === undefined) {
      error(ctx, "Unbound variable: " + symName);
      return null;
    }
    return symVal;
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

  if (fnName == "if") {
    // TODO: check arity in interpreter or (better) parser.
    const condition = evalExpr(ctx, expr.value[1]);

    // TODO: error on non-boolean condition.
    let nextExpr;
    if (condition.value) {
      nextExpr = expr.value[2];
    } else {
      nextExpr = expr.value[3];
    }

    return evalExpr(ctx, nextExpr);
  } else if (fnName == "set") {
    // TODO: check arity in interpreter or (better) parser.
    const value = evalExpr(ctx, expr.value[2]);

    // TODO: check that this is a symbol.
    const sym = expr.value[1].value;
    ctx.env[sym] = value;

    return null;
  } else if (fnName == "while") {
    // TODO: check arity in interpreter or (better) parser.
    const condition = evalExpr(ctx, expr.value[1]);

    // TODO: error on non-boolean condition.
    if (condition.value) {
      // TODO: add the UI to break from infinite loops.
      const body = expr.value.slice(2);
      return evalExprs(ctx, body);
    } else {
      return null;
    }
  }

  const fn = ctx.env[fnName];
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
  const ctx = { stdout: null, error: null, env: { print, add } };
  ctx.result = evalExprs(ctx, exprs);

  return ctx;
}
