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
 * interface MyEventMap {
 *  "eventName1": {
 *    isPromise: true;
 *    params: any;
 *    data: any;
 *  };
 *  "eventName2": {
 *    isPromise: true;
 *    params: any;
 *    data: any;
 *  };
 *  ...
 * }
 */
interface MyEventMap {
  "load-error": {
    data: Error;
  };
  "close-modal": {};
  "fetch-init-data": {
    isPromise: true;
    params: {
      data: any;
    };
    data: {
      code: 200;
    };
  };
}

const rpc: TypedRPC<MyEventMap> = new RPC({
  target: window.top!,
  serviceId: "test",
});

rpc.call("close-modal");
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
