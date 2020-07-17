class EvalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EvalError";
    // Seems to be necessary in browser, although not in
    // node. Otherwise, we can't catch EvalError with instanceof.
    Object.setPrototypeOf(this, EvalError.prototype);
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
const TRUE_VALUE: Value = { name: "Bool", value: true };
const FALSE_VALUE: Value = { name: "Bool", value: false };

function print(ctx: Context, args: Array<Value>): Value {
  if (ctx.stdout === null) {
    ctx.stdout = "";
  }

  // TODO: Check arity.
  ctx.stdout += args[0].value;
  return NULL_VALUE;
}

function do_(_ctx: Context, args: Array<Value>): Value {
  if (args.length == 0) {
    return NULL_VALUE;
  }

  return args[args.length - 1];
}

function lte(_ctx: Context, args: Array<Value>): Value {
  // TODO: Check arity and type.
  let firstArg = args[0].value;
  let secondArg = args[1].value;

  return firstArg <= secondArg ? TRUE_VALUE : FALSE_VALUE;
}

function add(_ctx: Context, args: Array<Value>): Value {
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

function isBool(expr: Value): boolean {
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
  if (expr.name == "Assign") {
    // TODO: access items in AST node by name, not index.
    const value = evalExpr(ctx, expr.value[1]);

    const sym = expr.value[0].value;
    ctx.env[sym] = value;

    return NULL_VALUE;
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
    const rawCondition = expr.value[0];
    const rawBody = expr.value[1];

    while (true) {
      const condition = evalExpr(ctx, rawCondition);
      if (!isBool(condition)) {
        error("While conditions must be bool, but got " + condition.name);
      }

      if (condition.value == false) {
        break;
      }
      evalExpr(ctx, rawBody);
    }

    return NULL_VALUE;
  }

  if (expr.name !== "FunctionCall") {
    error("Expected a function call, but got: " + expr.name);
  }

  if (expr.value.length === 0) {
    error("Not a valid expression.");
  }

  // TODO: check fnName is a symbol.
  const fnName: string = expr.value[0].value;

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
    env: { print, add, lte, do: do_ }
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
