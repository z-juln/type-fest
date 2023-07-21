# @juln/type-fest

A collection of essential TypeScript types based on 'type test'

## common-types

base on `type test`: <https://www.npmjs.com/package/type-fest>

### `PartialPartial`

Make partial properties in T optional.

### `PartialRequired`

Make partial properties in T required.

## better-typed

针对第三方库进行 ts 类型的加强

### `TypedRPC`

加强 @mixer/postmessage-rpc

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

加强 EventEmitter3

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
