import { expectError, expectType } from 'tsd';
import { PureArray } from './../../src/type-fest/array';
import { DeepKeysOfSpreadable, MergeObjects } from './../../src/type-fest/object.d';

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

{
  type O1 = {
    a: 'a';
    c: 'c';
    d: {
      d1: 0;
    };
    e: 'e';
    f: 'f1';
  };
  type O2 = {
    b: 'b';
    c: 'c';
    d: {
      d2: 1;
    };
    e: { e: 'e'; };
    f: 'f2';
  };
  type Res = MergeObjects<[O1, O2]>;
  type ExpectType = {
    a?: 'a';
    b?: 'b';
    c: 'c';
    d: {
      d1?: 0;
      d2?: 1;
    };
    e: 'e' | {
      e: 'e';
    };
    f: 'f1' | 'f2';
  };
  expectType<Res extends ExpectType ? true : false>(true);
  expectType<ExpectType extends Res ? true : false>(true);
}
