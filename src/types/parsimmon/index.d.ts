import Parsimmon from "parsimmon";

// TODO: Submit PR for typing for parsimmon to allow .assert.
declare module "parsimmon" {
  interface Parser<T> {
    /**
     * Passes the result of `parser` to the function `condition`,
     * which returns a boolean. If the the condition is false, returns
     * a failed parse with the given `message`. Else is returns the
     * original result of `parser`.
     */
    assert<U>(condition: (result: U) => boolean, message: string): Parser<U>;
  }
}
