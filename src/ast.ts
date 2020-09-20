export type NumberValue = {
  name: "Number";
  value: number;
};

export type BoolValue = {
  name: "Bool";
  value: boolean;
};

export type StringValue = {
  name: "String";
  value: string;
};

export type NullValue = {
  name: "null";
  value: null;
};

type FunctionValue<T> = {
  name: "Function";
  value: (ctx: T, exprs: Array<Value<T>>) => Value<T>;
};

export type Value<T> =
  | NumberValue
  | BoolValue
  | StringValue
  | NullValue
  | FunctionValue<T>;

type SymbolExpr = {
  name: "Symbol";
  value: string;
};

type BlockExpr<T> = {
  name: "Block";
  value: { body: Array<Expr<T>> };
};

type AssignExpr<T> = {
  name: "Assign";
  value: { sym: SymbolExpr; value: Expr<T> };
};

type IfExpr<T> = {
  name: "If";
  value: { condition: Expr<T>; then: Expr<T>; else: Expr<T> };
};

type WhileExpr<T> = {
  name: "While";
  value: Array<Expr<T>>;
};

type FunctionCallExpr<T> = {
  name: "FunctionCall";
  value: { fun: Expr<T>; args: Array<Expr<T>> };
};

export type Expr<T> =
  | Value<T>
  | SymbolExpr
  | BlockExpr<T>
  | AssignExpr<T>
  | IfExpr<T>
  | WhileExpr<T>
  | FunctionCallExpr<T>;
