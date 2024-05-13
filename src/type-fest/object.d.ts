import { ValueOf } from 'type-fest';

type TupleOrArray = readonly [...unknown[]];

/**
 * An object or an array.
 */
export type Spreadable = object | TupleOrArray;

type InnerDeepKeysOfSpreadable<
  Obj extends Record<any, any>,
  Keys extends string | number | symbol = keyof Obj,
> = ValueOf<{
  [K in Keys]: Obj[K] extends Spreadable
    ? InnerDeepKeysOfSpreadable<Obj[K]>
    : K;
}>;

/**
 * Get all keys of an spreadable type recursively.
 * @example
 * ```ts
 * type Obj = {
 *   0: string;
 *   a: {
 *     b: {
 *       c: string;
 *       d: string;
 *     };
 *   };
 *   e: string;
 *   f: string;
 *   [Symbol.hasInstance]: 0;
 * };
 * type Keys = DeepKeysOfObjectFormula<Obj>; // `Keys` equivalent to 0 | 'c' | 'd' | 'f' | Symbol.hasInstance;
 */
export type DeepKeysOfSpreadable<Obj extends Record<any, any>> = InnerDeepKeysOfSpreadable<Obj>;
import { ValueOf } from 'type-fest';

type TupleOrArray = readonly [...unknown[]];

/**
 * An object or an array.
 */
export type Spreadable = object | TupleOrArray;

type InnerDeepKeysOfSpreadable<
  Obj extends Record<any, any>,
  Keys extends string | number | symbol = keyof Obj,
> = ValueOf<{
  [K in Keys]: Obj[K] extends Spreadable
    ? InnerDeepKeysOfSpreadable<Obj[K]>
    : K;
}>;

/**
 * @example
 * ```ts
 * type AC = {
 *   a: 'a';
 *   c: 'c';
 * };
 * type BC = {
 *   b: 'b';
 *   c: 'c';
 * };
 * type Res = MergeObject<AC, BC>; // { a?: 'a'; b?: 'b'; c: 'c'; };
 * ```
 */
export type MergeObject<O1, O2, O3, O4, O5, O6> = {
  [K in keyof (O1 & O2 & O3 & O4 & O5 & O6)]?: (O1 & O2 & O3 & O4 & O5 & O6)[K];
} & {
  [K in keyof (O1 | O2 | O3 | O4 | O5 | O6)]: (O1 | O2 | O3 | O4 | O5 | O6)[K];
};
