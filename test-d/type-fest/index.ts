import { expectError, expectType } from 'tsd';
import { PureArray } from './../../src/type-fest/array';
import { DeepKeysOfSpreadable } from './../../src/type-fest/object.d';

{
  type ExpectType = [1, "", false, number, string, boolean, symbol, {}, object, Error, null, undefined];
  expectType<ExpectType>(
    {} as PureArray<[1, '', false, number, string, boolean, symbol, {}, object, Error, null, undefined, never, void]>
  );
}

{
  type ExpectType = readonly [1, "", false, number, string, boolean, symbol, {}, object, Error, null, undefined];
  expectType<ExpectType>(
    {} as PureArray<readonly [1, '', false, number, string, boolean, symbol, {}, object, Error, null, undefined, never, void]>
  );
}

{
  type Obj = {
    0: string;
    a: {
      b: {
        c: string;
        d: string;
      };
    };
    e: string;
    f: string;
    [Symbol.hasInstance]: 0;
  };
  type ExpectType = 0 | 'c' | 'd' | 'f' | typeof Symbol.hasInstance;
  expectType<ExpectType extends DeepKeysOfSpreadable<Obj> ? true : false>(
    true
  );
  expectError<DeepKeysOfSpreadable<Obj>>(
    {} as typeof Symbol.iterator
  );
}
