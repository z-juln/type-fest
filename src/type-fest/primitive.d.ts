// void extends unknown
// never extends void
// undefined extends void
// never extends undefined
// 结论:
// 1. object、any 逃离三界之外
// 2. <never> extends <undefined> extends <void> extends <unknown>

import { IsNever } from "type-fest";


/**
 * true -> false; false -> true
 * 
 * @example
 * type False = Negate<true>; // false
 * type True = Negate<false>; // true
 */
export type Negate<T extends boolean> = T extends true ? false : true;

/**
 * (void extends T) and (T extends void)
 */
export type IsVoid<T> = void extends T ? T extends void ? true : false : false;

/**
* (undefined extends T) and (T extends undefined)
*/
export type IsUndefined<T> = undefined extends T ? T extends undefined ? true : false : false;
/**
 * (object extends T) and (T extends object)
 */
export type IsObject<T> = object extends T ? T extends object ? true : false : false;

/**
 * filter out `never` and `void`
 */
export type IsValue<T> =
  IsNever<T> extends true
    ? false
    : IsVoid<T> extends true
      ? false
      : true;
