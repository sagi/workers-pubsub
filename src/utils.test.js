import '@sagi.io/globalthis';
import * as utils from './utils';

describe('utils', () => {
  test('createPubSubMessage', () => {
    expect(() => utils.createPubSubMessage()).toThrow();

    const message1 = 'abcdefg';
    const attributes1 = { type: 'slack-poll' };
    const expected1 = {
      attributes: {
        type: 'slack-poll',
      },
      data: 'YWJjZGVmZw',
    };
    expect(
      utils.createPubSubMessage({ message: message1, attributes: attributes1 })
    ).toEqual(expected1);

    const message2 = 'abcdefg';
    const attributes2 = undefined;
    const expected2 = {
      data: 'YWJjZGVmZw',
    };
    expect(
      utils.createPubSubMessage({ message: message2, attributes: attributes2 })
    ).toEqual(expected2);
  });

  test('setGlobals', () => {
    const fetchImpl1 = null;
    expect(() => utils.setGlobals(fetchImpl1)).toThrow();
    expect(() => utils.setGlobals()).toThrow();
    const fetchImpl2 = 'not null...';
    utils.setGlobals(fetchImpl2);
    expect(globalThis.fetch).toEqual(fetchImpl2);
  });

  test('injectBaseinputs', () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    const fnObj = { fnName1: fn1, fnName2: fn2 };
    const baseInputs = { satoshi: 'nakamoto' };
    utils.injectBaseinputs(baseInputs, fnObj);
    expect(fn1).toHaveBeenCalledWith(baseInputs);
    expect(fn2).toHaveBeenCalledWith(baseInputs);
  });
});
