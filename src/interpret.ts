import type { LangOpts } from "./options";
import type {
  Value,
  NullValue,
  BoolValue,
  StringValue,
  NumberValue,
  Expr,
} from "./ast";

class EvalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EvalError";
    // Seems to be necessary in browser, although not in
    // node. Otherwise, we can't catch EvalError with instanceof.
    Object.setPrototypeOf(this, EvalError.prototype);
  }
}

export type Context = {
  stdout: null | string;
  env: Record<string, Value<Context>>;
  result: Value<Context>;
  error: null | string;
  opts: LangOpts;
};

const NULL_VALUE: NullValue = { name: "null", value: null };
const TRUE_VALUE: BoolValue = { name: "Bool", value: true };
const FALSE_VALUE: BoolValue = { name: "Bool", value: false };

function print(ctx: Context, args: Array<Value<Context>>): NullValue {
  if (args.length != 1) {
    error("print takes 2 argument, but got: " + args.length);
  }

  if (ctx.stdout === null) {
    ctx.stdout = "";
  }

  // TODO: Check arity.
  ctx.stdout += args[0].value;
  ctx.stdout += "\n";
  return NULL_VALUE;
}

function lte(_ctx: Context, args: Array<Value<Context>>): BoolValue {
  if (args.length != 2) {
    error("lte takes 2 arguments, but got: " + args.length);
  }

  const firstArg = args[0];
  const secondArg = args[1];

  if (firstArg.name == "Number" && secondArg.name == "Number") {
    return firstArg.value <= secondArg.value ? TRUE_VALUE : FALSE_VALUE;
  }

  error(
    `Expected number arguments to lte, but got ${firstArg.name} and ${secondArg.name}`
  );
}

function equal(_ctx: Context, args: Array<Value<Context>>): BoolValue {
  if (args.length != 2) {
    error("equal takes 2 arguments, but got: " + args.length);
  }

  const firstArg = args[0].value;
  const secondArg = args[1].value;

  return firstArg === secondArg ? TRUE_VALUE : FALSE_VALUE;
}

function concat(_ctx: Context, args: Array<Value<Context>>): StringValue {
  const parts: Array<string> = [];

  args.forEach((arg) => {
    if (arg.name == "String") {
      parts.push(arg.value);
    } else {
      error(`Expected string arguments to concat, but got a ${arg.name}`);
    }
  });

  return { name: "String", value: parts.join("") };
}

function repr(ctx: Context, args: Array<Value<Context>>): StringValue {
  if (args.length != 1) {
    error("repr takes 1 argument, but got: " + args.length);
  }

  const arg = args[0];
  if (arg.name != "String") {
    error("repr takes a string argument, but got: " + arg.name);
  }

  const delim = ctx.opts.stringDelimiter;
  const inner = arg.value
    .split("")
    .map((c) => {
      if (c == "\n") {
        return "\\n";
      } else if (c == "\\") {
        return "\\\\";
      } else if (c == delim) {
        // TODO: handle string delimiters of more than one character.
        return "\\" + delim;
      } else {
        return c;
      }
    })
    .join("");

  return { name: "String", value: delim + inner + delim };
}

function mod(_ctx: Context, args: Array<Value<Context>>): NumberValue {
  if (args.length != 2) {
    error("mod takes 2 arguments, but got: " + args.length);
  }

  const firstArg = args[0];
  const secondArg = args[1];

  if (firstArg.name == "Number" && secondArg.name == "Number") {
    return { name: "Number", value: firstArg.value % secondArg.value };
  }

  error(
    `Expected number arguments to mod, but got ${firstArg.name} and ${secondArg.name}`
  );
}

function add(_ctx: Context, args: Array<Value<Context>>): NumberValue {
  if (args.length != 2) {
    error("add takes 2 arguments, but got: " + args.length);
  }

  const firstArg = args[0];
  const secondArg = args[1];

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

function evalExpr(ctx: Context, expr: Expr<Context>): Value<Context> {
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
  if (expr.name == "Block") {
    let result: Value<Context> = NULL_VALUE;
    expr.value.body.forEach((expr) => {
      result = evalExpr(ctx, expr);
    });

    return result;
  }
  if (expr.name == "Assign") {
    const value = evalExpr(ctx, expr.value.value);

    const sym = expr.value.sym;
    ctx.env[sym.value] = value;

    return NULL_VALUE;
  }
  if (expr.name == "If") {
    const condition = evalExpr(ctx, expr.value.condition);

    if (condition.name != "Bool") {
      error("If conditions must be bool, but got " + condition.name);
    }

    let nextExpr;
    if (condition.value) {
      nextExpr = expr.value.then;
    } else {
      nextExpr = expr.value.else;
    }

    return evalExpr(ctx, nextExpr);
  }
  if (expr.name == "While") {
    const rawCondition = expr.value[0];
    const rawBody = expr.value[1];

    while (true) {
      const condition = evalExpr(ctx, rawCondition);
      if (condition.name != "Bool") {
        error("While conditions must be bool, but got " + condition.name);
      }

      if (!condition.value) {
        break;
      }
      evalExpr(ctx, rawBody);
    }

    return NULL_VALUE;
  }

  if (expr.name !== "FunctionCall") {
    error("Expected a function call, but got: " + expr.name);
  }

  const fnName = expr.value.fun;
  if (fnName.name != "Symbol") {
    // TODO: allow arbitrary callables
    error("Function calls require a function name");
  }

  const fnValue = ctx.env[fnName.value];
  if (fnValue === undefined) {
    error(`Unbound variable '${fnName.value}' (expected a function)`);
  }

  if (fnValue.name != "Function") {
    error(`Expected a function to call, but got: ${fnValue.name}`);
  }

  const args = expr.value.args.map((rawArg) => evalExpr(ctx, rawArg));
  return fnValue.value(ctx, args);
}
function evalExprs(ctx: Context, exprs: Array<Expr<Context>>): Value<Context> {
  let result: Value<Context> = NULL_VALUE;

  exprs.forEach((expr) => {
    result = evalExpr(ctx, expr);
  });

  return result;
}

export function run(exprs: Array<Value<Context>>, opts: LangOpts): Context {
  const ctx: Context = {
    opts,
    result: NULL_VALUE,
    stdout: null,
    error: null,
    env: {
      print: { name: "Function", value: print },
      add: { name: "Function", value: add },
      lte: { name: "Function", value: lte },
      mod: { name: "Function", value: mod },
      equal: { name: "Function", value: equal },
      concat: { name: "Function", value: concat },
      repr: { name: "Function", value: repr },
    },
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
