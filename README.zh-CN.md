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

编写类型编程指南:

1. 类型编程最主要的就是，明确知道最基础的那些操作，哪些是联合转联合、哪些是联合转交叉、哪些是交叉转交叉、哪些是不可逆操作。
2. 然后剩下的就是逻辑拆分，拆分成各个类型函数，再组装起来，就 OK 了。

## common-types (通用类型)

基于 [`type-fest`](https://www.npmjs.com/package/type-fest) 进行二次开发，且暴露出 `type-fest` 提供的所有类型 (`type-fest` 的使用文档请自行去官方看，这里不提供)

### `As`

对类型的 "as" 操作. 类似于对“typescript”中的类型断言操作符 ——— `as`

用 "@ts-ignore" 会导致类型丢失, 大部分场景不如 "as" 操作舒服

```TypeScript
type BetterContent<D extends { content: string }, prefix extends string> =
  D extends { content: infer C } ? `${prefix}: ${As<C, string>}` : never;
type R = BetterContent<{ content: 'xxx' }, 'content'>;
```

### `PartialPartial`

指定 object 的部分属性变成可选类型

```TypeScript
type R = PartialPartial<{ a: number; b: number; }, 'a'>; // { a?: number; b: number; }
```

### `PartialRequired`

指定 object 的部分属性变成不可选类型

```TypeScript
type R = PartialRequired<{ a?: number; b?: number; }, 'a'>; // { a: number; b?: number; }
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
