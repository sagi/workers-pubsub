import '@sagi.io/globalthis';

const ERR_PREFIX = `@sagi.io/cfw-pubsub`;

// https://cloud.google.com/pubsub/docs/reference/rest/v1/PubsubMessage
export const createPubSubMessage = ({
  message = '',
  attributes = null,
} = {}) => {
  if (!message && !attributes) {
    throw new Error(
      `${ERR_PREFIX}: must either have a non-empty message field or at least one attribute.`
    );
  }
};

export const setGlobals = (fetchImpl = null) => {
  if (!globalThis.fetch) {
    if (!fetchImpl) {
      throw new Error(`${ERR_PREFIX}: No fetch nor fetchImpl were found.`);
    } else {
      globalThis.fetch = fetchImpl;
    }
  }
};

export const injectBaseinputs = (baseInputs, fnObj) =>
  Object.entries(fnObj).reduce(
    (acc, [name, fn]) => ({ ...acc, [name]: fn(baseInputs) }),
    {}
  );
