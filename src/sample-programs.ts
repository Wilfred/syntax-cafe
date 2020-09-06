import type { LangOpts } from "./options";

export function helloworld(opts: LangOpts): string {
  return `(print ${opts.stringDelimiter}Hello, world!${opts.stringDelimiter})
`;
}

export function fizzbuzz(opts: LangOpts, blockStyle: string): string {
  if (blockStyle == "curly") {
    return `(set i 1)
(${opts.whileKeyword} (lte i 20) {
  ${opts.ifKeyword} (equal (mod i 15) 0) {
    (print ${opts.stringDelimiter}FizzBuzz${opts.stringDelimiter})
  } else {
    ${opts.ifKeyword} (equal (mod i 5) 0) {
      (print ${opts.stringDelimiter}Buzz${opts.stringDelimiter})
    } else {
      ${opts.ifKeyword} (equal (mod i 3) 0) {
        (print ${opts.stringDelimiter}Fizz${opts.stringDelimiter})
      } else {
        (print i)
      }
    }
  }
  (set i (add i 1))
})
`;
  } else {
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
  }
}

export function quine(opts: LangOpts): string {
  return `(set w ${opts.stringDelimiter}(print (concat \\${opts.stringDelimiter}(set w \\${opts.stringDelimiter} (repr w) \\${opts.stringDelimiter})\\${opts.stringDelimiter}))\\n(print w)${opts.stringDelimiter})
(print (concat ${opts.stringDelimiter}(set w ${opts.stringDelimiter} (repr w) ${opts.stringDelimiter})${opts.stringDelimiter}))
(print w)
`;
}
