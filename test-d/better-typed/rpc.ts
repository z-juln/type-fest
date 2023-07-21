import { expectError } from 'tsd';
import TypedRPC, { TypedSimpleRPC } from "../../src/better-typed/rpc";
import { RPC } from '@mixer/postmessage-rpc';

type ExposeMap = {
  'load-error': {
    data: Error;
  };
  'close': {
  };
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
  'close': {};
}

const rpc = new RPC({
  target: window.frames,
  serviceId: 'test',
}) as any as TypedRPC<ExposeMap, CallMap>;

// test1: expose
// TypedRPC只能接受固定格式的范型
expectError(() => {
  type Test1 = TypedRPC<{
    'load-error': {
      data: Error;
    };
  }, false>;
});
// EventName有代码提示
rpc.expose('load-error', () => {
  return new Error('load-error');
});
rpc.expose('result', async ({ pageNum, pageSize }) => {
  return {
    code: 200,
    list: [
      { content: 'xxx' },
    ],
  };
});
// params不对, 代码报错
expectError(
  rpc.expose('result', async ({ limit }) => {
    return {
      code: 200,
      list: [
        { content: 'xxx' },
      ],
    };
  })
);
// returnType不对, 代码报错
expectError(
  rpc.expose('result', async ({ pageNum, pageSize }) => {
    return {
      code: 200,
    };
  })
);
// isPromise设置为true时, returnValue必须是promise, 代码报错
expectError(
  rpc.expose('result', ({ pageNum, pageSize }) => {
    return {
      code: 200,
      data: { a: 1 },
    };
  })
);
// 1. 严格模式下, 未声明的eventName, 代码报错
expectError(
  (rpc as TypedRPC<ExposeMap, CallMap>).expose('unkown', (a: any) => a)
);
// 2. 非严格模式下, 未声明的eventName, handler为: (params: any） => Promise<any> | any)
(rpc as TypedRPC<ExposeMap, CallMap, false>).expose('unkown', a => a);
// call上的Event不能使用
expectError(
  rpc.expose('simpleLoad', () => {})
);

// test2: call
// EventName有代码提示
rpc.call('load', {
  immediately: true,
});
// 无params时, params必须为object (rpc本来就是object类型)
rpc.call('simpleLoad', {});
// params不对, 代码报错
expectError(
  rpc.call('load', {a: 1})
);
// 不传waitForReply时, 返回值为promise<Data>
rpc.call('load', {})
  .then(() => {
    
  });
// 传waitForReply=false时, 返回值为void, 代码报错
expectError(
  rpc.call('load', {}, false)
    .then(() => {
      
    })
);
// expose上的Event不能使用
expectError(
  rpc.call('load-error', {})
);
// expose与call重复时, 没问题
rpc.call('close', {});

// 3. TypedSimpleRPC
const t1 = {} as TypedRPC<{}, {}>;
const t2 = {} as TypedSimpleRPC<{}, {}>;
