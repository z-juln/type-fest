type HexDigit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f';

/**
 * HexColor<'#fff'> -> '#fff';
 * HexColor<'#ffffff'> -> '#ffffff';
 * HexColor<'#xxx'> -> never;
 */
export type HexColor<T extends string> = T extends `#${HexDigit}${HexDigit}${HexDigit}${infer Rest1}`
  ? (Rest1 extends ``
      ? T // three-digit hex color
      : (
        Rest1 extends `${HexDigit}${HexDigit}${HexDigit}`
          ? T // six-digit hex color
          : never
      )
    )
  : never;
