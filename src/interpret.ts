class EvalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EvalError";
    // Seems to be necessary in browser, although not in
    // node. Otherwise, we can't catch EvalError with instanceof.
    Object.setPrototypeOf(this, EvalError.prototype);
  }
}

interface NumberValue {
  name: "Number";
  value: number;
}

interface BoolValue {
  name: "Bool";
  value: boolean;
}

interface StringValue {
  name: "String";
  value: string;
}

interface NullValue {
  name: "null";
  value: null;
}

export type Value = NumberValue | BoolValue | StringValue | NullValue;

interface SymbolExpr {
  name: "Symbol";
  value: string;
}

interface AssignExpr {
  name: "Assign";
  value: Array<Expr>;
}

interface IfExpr {
  name: "If";
  value: Array<Expr>;
}

interface WhileExpr {
  name: "While";
  value: Array<Expr>;
}

interface FunctionCallExpr {
  name: "FunctionCall";
  value: { fun: Value; args: Array<Expr> };
}

type Expr =
  | Value
  | SymbolExpr
  | AssignExpr
  | IfExpr
  | WhileExpr
  | FunctionCallExpr;

export interface Context {
  stdout: null | string;
  env: Record<string, any>;
  result: Value;
  error: null | string;
}

const NULL_VALUE: NullValue = { name: "null", value: null };
const TRUE_VALUE: BoolValue = { name: "Bool", value: true };
const FALSE_VALUE: BoolValue = { name: "Bool", value: false };

function print(ctx: Context, args: Array<Value>): NullValue {
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

function lte(_ctx: Context, args: Array<Value>): BoolValue {
  if (args.length != 2) {
    error("lte takes 2 arguments, but got: " + args.length);
  }

  let firstArg = args[0];
  let secondArg = args[1];

  if (firstArg.name == "Number" && secondArg.name == "Number") {
    return firstArg.value <= secondArg.value ? TRUE_VALUE : FALSE_VALUE;
  }

  error(
    `Expected number arguments to lte, but got ${firstArg.name} and ${secondArg.name}`
  );
}

function equal(_ctx: Context, args: Array<Value>): BoolValue {
  if (args.length != 2) {
    error("equal takes 2 arguments, but got: " + args.length);
  }

  let firstArg = args[0].value;
  let secondArg = args[1].value;

  return firstArg === secondArg ? TRUE_VALUE : FALSE_VALUE;
}

function mod(_ctx: Context, args: Array<Value>): NumberValue {
  if (args.length != 2) {
    error("mod takes 2 arguments, but got: " + args.length);
  }

  let firstArg = args[0];
  let secondArg = args[1];

  if (firstArg.name == "Number" && secondArg.name == "Number") {
    return { name: "Number", value: firstArg.value % secondArg.value };
  }

  error(
    `Expected number arguments to mod, but got ${firstArg.name} and ${secondArg.name}`
  );
}

function add(_ctx: Context, args: Array<Value>): NumberValue {
  if (args.length != 2) {
    error("add takes 2 arguments, but got: " + args.length);
  }

  let firstArg = args[0];
  let secondArg = args[1];

  if (firstArg.name == "Number" && secondArg.name == "Number") {
    return { name: "Number", value: firstArg.value + secondArg.value };
  }

  error(
    `Expected number arguments to add, but got ${firstArg.name} and ${secondArg.name}`
  );
}

function error(msg: string): never {
  /* eslint-env node */
  if (process.env.NODE_ENV != "test") {
    // Log on the browser, but don't clutter up test output.
    console.error(msg);
  }

  throw new EvalError(msg);
}

function isBool(expr: Expr): boolean {
  return expr.name == "Bool";
}

function evalExpr(ctx: Context, expr: Expr): Value {
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

  // TODO: check fnName is a symbol or valid callable.
  const fnName: string = expr.value.fun.value;

  const fn = ctx.env[fnName];
  if (fn === undefined) {
    error("No such function: " + fnName);
  }

  const rawArgs = expr.value.args;
  const args = rawArgs.map(rawArg => evalExpr(ctx, rawArg));

  return fn(ctx, args);
}
function evalExprs(ctx: Context, exprs: Array<Expr>): Value {
  let result: Value = NULL_VALUE;

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
    env: { print, add, lte, mod, equal, do: do_ }
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
