import { PureArray } from './../../src/type-fest/array';
import { expectType } from 'tsd';

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
