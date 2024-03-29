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
