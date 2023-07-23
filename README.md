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
  English | <a href='./README.zh-CN.md'>简体中文</a>
</p>

A collection of TypeScript types that have undergone type testing

Based on [`type-fest`](https://www.npmjs.com/package/type-fest) Conduct secondary development and expose all types provided by `type-fest` (please refer to the official documentation for the use of `type test`, which is not provided here)

Programming Guide for Writing Types:

1. The most important aspect of type programming is to clearly know the most basic operations, which are joint to joint, joint to cross, cross to cross, and irreversible.
2. Then the rest is logical splitting, breaking it down into various types of functions, and assembling them together, and that's all.

## common-types

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

## array-types (about array)

### `PureArray`

filter out `never` and `void`

```TypeScript
type Arr = [1, '', false, number, string, boolean, symbol, {}, object, Error, null, undefined, never, void];
type Arr = PureArray<Arr>; // [1, "", false, number, string, boolean, symbol, {}, object, Error, null, undefined]
```

## better-typed

Strengthening the TS type for third-party libraries

### `TypedRPC`

Strengthen [`@mixer/postmessage-rpc`](https://www.npmjs.com/package/@mixer/postmessage-rpc)

```TypeScript
import { RPC } from "@mixer/postmessage-rpc";
import type { TypedRPC } from "@juln/type-fest";

/**
 * Only 'type' can be used, not 'interface', otherwise lax type constraints will cause problems
 *
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

rpc.call("close-modal", {}); // Restrictions on types such as 'eventName', 'params', and 'returnType'
rpc.call("unknown", {}); // 'eventName' not declared, type error reported

// 2. In non strict mode, for undeclared 'eventName', the type does not report an error, and the 'handler' is: (params: any） => Promise<any> | any)
(rpc as TypedRPC<ExposeMap, CallMap, false>).expose('unkown', a => a);
```

### `TypedEventEmitter`

Strengthen [`eventemitter3`](https://www.npmjs.com/package/eventemitter3)

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
