class EvalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EvalError";
  }
}

interface Value {
  name: string;
  value: any;
}

interface Context {
  stdout: null | string;
  env: Record<string, any>;
  result: Value | null;
  error: null | string;
}

const NULL_VALUE: Value = { name: "null", value: null };

function print(ctx: Context, args: Array<Value>): Value | null {
  if (ctx.stdout === null) {
    ctx.stdout = "";
  }

  // TODO: Check arity.
  ctx.stdout += args[0].value;
  return NULL_VALUE;
}

function add(ctx: Context, args: Array<Value>): Value {
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

function error(msg: string): never {
  /* eslint-env node */
  if (process.env.NODE_ENV != "test") {
    // Log on the browser, but don't clutter up test output.
    console.error(msg);
  }

  throw new EvalError(msg);
}

function isBool(expr: Value): bool {
  return expr.name == "Bool";
}

function evalExpr(ctx: Context, expr: Value): Value {
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
      error("Unbound variable: " + symName);
    }
    return symVal;
  }
  if (expr.name == "If") {
    const condition = evalExpr(ctx, expr.value[0]);

    if (!isBool(condition)) {
      error("If conditions must be bool, but got " + expr.name);
    }

    let nextExpr;
    if (condition.value) {
      nextExpr = expr.value[1];
    } else {
      nextExpr = expr.value[2];
    }

    return evalExpr(ctx, nextExpr);
  }
  if (expr.name == "While") {
    const condition = evalExpr(ctx, expr.value[0]);

    if (!isBool(condition)) {
      error("While conditions must be bool, but got " + expr.name);
    }

    if (condition.value) {
      // TODO: add the UI to break from infinite loops.
      // TODO: actually loop.
      const body = expr.value[1];
      return evalExpr(ctx, body);
    } else {
      return NULL_VALUE;
    }
  }

  if (expr.name !== "FunctionCall") {
    error("Expected a function call, but got: " + expr.name);
  }

  if (expr.value.length === 0) {
    error("Not a valid expression.");
  }

  // TODO: check fnName is a symbol.
  const fnName: string = expr.value[0].value;

  if (fnName == "set") {
    // TODO: check arity in interpreter or (better) parser.
    const value = evalExpr(ctx, expr.value[2]);

    // TODO: check that this is a symbol.
    const sym = expr.value[1].value;
    ctx.env[sym] = value;

    return NULL_VALUE;
  } else if (fnName == "while") {
    // TODO: check arity in interpreter or (better) parser.
    const condition = evalExpr(ctx, expr.value[1]);

    // TODO: error on non-boolean condition.
    if (condition.value) {
      // TODO: add the UI to break from infinite loops.
      const body = expr.value.slice(2);
      return evalExprs(ctx, body);
    } else {
      return NULL_VALUE;
    }
  }

  const fn = ctx.env[fnName];
  if (fn === undefined) {
    error("No such function: " + fnName);
  }

  const rawArgs = expr.value.slice(1);
  const args = rawArgs.map((rawArg: Value) => evalExpr(ctx, rawArg));

  return fn(ctx, args);
}
function evalExprs(ctx: Context, exprs: Array<Value>): Value {
  let result = NULL_VALUE;

  exprs.forEach(expr => {
    result = evalExpr(ctx, expr);
  });

  return result;
}

export function run(exprs: Array<Value>): Context {
  const ctx: Context = {
    result: NULL_VALUE,
    stdout: null,
    error: null,
    env: { print, add }
  };
  try {
    ctx.result = evalExprs(ctx, exprs);
  } catch (e) {
    if (e instanceof EvalError) {
      ctx.error = e.message;
    } else {
      throw e;
    }
  }

  return ctx;
}
