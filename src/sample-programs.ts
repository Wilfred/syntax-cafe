import type { LangOpts } from "./options";

export function helloworld(opts: LangOpts): string {
  if (opts.statementTerminator === null) {
    return `(print ${opts.stringDelimiter}Hello, world!${opts.stringDelimiter})
`;
  } else {
    return `(print ${opts.stringDelimiter}Hello, world!${opts.stringDelimiter})${opts.statementTerminator}
`;
  }
}

export function fizzbuzz(opts: LangOpts): string {
  if (opts.statementTerminator === null) {
    return `(set i 1)
(${opts.whileKeyword} (lte i 20)
  (do
    (${opts.ifKeyword} (equal (mod i 15) 0)
        (print ${opts.stringDelimiter}FizzBuzz${opts.stringDelimiter})
      (${opts.ifKeyword} (equal (mod i 5) 0)
          (print ${opts.stringDelimiter}Buzz${opts.stringDelimiter})
        (${opts.ifKeyword} (equal (mod i 3) 0)
            (print ${opts.stringDelimiter}Fizz${opts.stringDelimiter})
          (print i))))
    (set i (add i 1))))
`;
  } else {
    return `i = 1${opts.statementTerminator}
${opts.whileKeyword} (lte i 20) {
  ${opts.ifKeyword} (equal (mod i 15) 0) {
    (print ${opts.stringDelimiter}FizzBuzz${opts.stringDelimiter})${opts.statementTerminator}
  } else {
    ${opts.ifKeyword} (equal (mod i 5) 0) {
      (print ${opts.stringDelimiter}Buzz${opts.stringDelimiter})${opts.statementTerminator}
    } else {
      ${opts.ifKeyword} (equal (mod i 3) 0) {
        (print ${opts.stringDelimiter}Fizz${opts.stringDelimiter})${opts.statementTerminator}
      } else {
        (print i)${opts.statementTerminator}
      }
    }
  }
  i = (add i 1)${opts.statementTerminator}
}
`;
  }
}

export function quine(opts: LangOpts): string {
  return `(set w ${opts.stringDelimiter}(print (concat \\${opts.stringDelimiter}(set w \\${opts.stringDelimiter} (repr w) \\${opts.stringDelimiter})\\${opts.stringDelimiter}))\\n(print w)${opts.stringDelimiter})
(print (concat ${opts.stringDelimiter}(set w ${opts.stringDelimiter} (repr w) ${opts.stringDelimiter})${opts.stringDelimiter}))
(print w)
`;
}
