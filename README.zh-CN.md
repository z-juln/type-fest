<p align='center'>
  <img src='./screenshots/logo.svg' width='180'/>
</p>

<p align='center'>@juln/type-fest</p>

<!-- <p align='center'>
  <a href='https://discord.gg/UgKBCq9'>
    <img src='https://img.shields.io/badge/-Discord-yellowgreen?logo=discord&logoColor=white&color=7289da'/>
  </a>
  <a href='https://www.typescriptlang.org/play?install-plugin=%40type-challenges%2Fplayground-plugin'>
    <img src='https://img.shields.io/badge/Playground-143?logo=typescript&color=3178C6&logoColor=fff' />
  </a>
</p> -->

<br>

<p align='center'>
  简体中文 | <a href='./README.md'>English</a>
</p>

经过类型测试 的 TypeScript 类型的集合

基于 [`type-fest`](https://www.npmjs.com/package/type-fest) 进行二次开发，且暴露出 `type-fest` 提供的所有类型 (`type-fest` 的使用文档请自行去官方看，这里不提供)

编写类型编程指南:

1. 类型编程最主要的就是，明确知道最基础的那些操作，哪些是联合转联合、哪些是联合转交叉、哪些是交叉转交叉、哪些是不可逆操作。
2. 然后剩下的就是逻辑拆分，拆分成各个类型函数，再组装起来，就 OK 了。

## common-types (通用类型)

### `Negate`

true -> false; false -> true

```TypeScript
type False = Negate<true>; // false
type True = Negate<false>; // true
```

### `IsVoid`

(void extends T) and (T extends void)

### `IsUndefined`

(undefined extends T) and (T extends undefined)

### `IsObject`

(object extends T) and (T extends object)

### `IsValue`

filter out `never` and `void`

## function-types (增强函数)

### `PromiseFn`

将非 promise 的函数返回值变成 promise

```TypeScript
type OriginalFn = (a: 1, b: 2) => number;
type Fn = PromiseFn<OriginalFn>; // (a: 1, b: 2) => Promise<number>
```

### `PromisableFn`

将非 promise 的函数返回值变成 promisable

```TypeScript
type OriginalFn = (a: 1, b: 2) => number;
type Fn = PromisableFn<OriginalFn>; // (a: 1, b: 2) => Promise<number> | number
```

## array-types (关于数组)

### `ReadonlyArray`

```TypeScript
type OriginalArr = [1, ''];
type Arr = ReadonlyArray<OriginalArr>; // readonly [1, '']
```

## object-types (about object)

### `Spreadable`

```TypeScript
type Obj = {
  a: 1;
  b: 2;
  c: 3;
};
type ObjIsSpreadable = Obj extends Spreadable ? true : false; // true
```

### `DeepKeysOfSpreadable`

递归获取可扩展类型的所有键。

```TypeScript
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
type Keys = DeepKeysOfSpreadable<Obj>; // `Keys` 等价于 0 | 'c' | 'd' | 'f' | Symbol.hasInstance;
```

### `MergeObjects`

合并多个对象

```TypeScript
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
type Res = MergeObjects<[O1, O2, ...]>; // { a?: 'a'; b?: 'b'; c: 'c'; d: { d1?: 0; d2?: 1; }; e: 'e' | { e: 'e'; }; f: 'f1' | 'f2'; };
```

### `MixedTuple`

合并多个对象. 具体看 `MergeObjects`

```TypeScript
type Res = MergeObjects<O1 | O2>;
```

### `PureArray`

过滤掉 `never` 和 `void`

```TypeScript
type OriginalArr = [1, '', false, number, string, boolean, symbol, {}, object, Error, null, undefined, never, void];
type Arr = PureArray<OriginalArr>; // [1, "", false, number, string, boolean, symbol, {}, object, Error, null, undefined]

type ReadonlyOriginalArr = readonly [1, 2, never, void];
type ReadonlyArr = PureArray<ReadonlyOriginalArr>; // readonly [1, 2]
```

## `TuplifyUnion`

Union 转 tuple, 但是tuple的顺序不可靠, 有可能是 [X, Y] 也可能是 [Y, X]
```typescript
type abc = 'a' | 'b' | 'c';
type t = TuplifyUnion<abc>; // ["a", "b", "c"]
```

## color-types (about color)

### `HexColor`

校验16进制颜色值

```TypeScript
type Res1 = HexColor<'#fff'> // '#fff';
type Res2 = HexColor<'#ffffff'> // '#ffffff';
type Res3 = HexColor<'#xxx'> // never;
```

## better-typed (增强第三方类型)

针对第三方库进行 ts 类型的加强

### `TypedRPC`

加强 [`@mixer/postmessage-rpc`](https://www.npmjs.com/package/@mixer/postmessage-rpc)

```TypeScript
import { RPC } from "@mixer/postmessage-rpc";
import type { TypedRPC } from "@juln/type-fest";

/**
 * 只能用type, 不能用interface, 不然类型约束不严格会有问题
 * type ExposeMap = {
 *  "exposeName1": {
 *    isPromise: true;
 *    params: any;
 *    data: any;
 *  };
 *  "exposeName2": {
 *    isPromise: true;
 *    params: any;
 *    data: any;
 *  };
 *  ...
 * }
 */
type ExposeMap = {
  'load-error': {
    data: Error;
  };
  'close-window': {};
  'result': {
    isPromise: true;
    params: {
      pageNum?: number;
      pageSize?: number;
    };
    data: {
      code: number;
      list: any[];
    };
  };
}

/**
 * 与ExposeMap用法一致
 */
type CallMap = {
  'simpleLoad': {};
  'load': {
    params: {
      immediately?: boolean;
    };
    data: {
      success: boolean;
    };
  };
  'close-modal': {};
}

const rpc: TypedRPC<ExposeMap, CallMap> = new RPC({
  target: window.top!,
  serviceId: "test",
});

rpc.call("close-modal", {}); // eventName, params, returnType等类型限制
rpc.call("unknown", {}); // 未声明eventName, 类型报错

// 2. 非严格模式下, 未声明的eventName, 类型不报错, handler为: (params: any） => Promise<any> | any)
(rpc as TypedRPC<ExposeMap, CallMap, false>).expose('unkown', a => a);
```

### `TypedEventEmitter`

加强 [`eventemitter3`](https://www.npmjs.com/package/eventemitter3)

```TypeScript
import { EventEmitter } from "eventEmitter3";
import type { TypedEventEmitter } from "@juln/type-fest";

/**
 * interface MyEventMap {
 *  "eventName1": {
 *    args: [arg1: any, arg2: any, ...];
 *  };
 *  "eventName2": {
 *    args: [arg1: any, arg2: any, ...];
 *  };
 *  ...
 * }
 */
interface MyEventMap {
  'load-error': {
    args: [Error];
  };
  'close': {
  };
  'result': {
    args: [
      result1: number,
      result2: string,
      result3: null,
    ];
  };
}

const ee = new EventEmitter();
ee.emit('close');
```
