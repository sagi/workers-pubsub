import '@sagi.io/globalthis';
import { Base64 } from 'js-base64';

const ERR_PREFIX = `@sagi.io/workers-pubsub`;

export const keepTruthyProperties = (obj) =>
  Object.entries(obj).reduce(
    (acc, [k, v]) => ({ ...acc, ...(v ? { [k]: v } : {}) }),
    {}
  );

// https://cloud.google.com/pubsub/docs/reference/rest/v1/PubsubMessage
export const createPubSubMessage = ({
  message = null,
  attributes = null,
  ordering_key = null,
} = {}) => {
  if (!message && !attributes) {
    throw new Error(
      `${ERR_PREFIX}: must either have a non-empty message field or at least one attribute.`
    );
  }
  const data = message ? Base64.encode(message, true) : null;
  const psMessage = { data, attributes, ordering_key };
  return keepTruthyProperties(psMessage);
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

export const injectBaseInputs = (baseInputs, fnObj) =>
  Object.entries(fnObj).reduce(
    (acc, [name, fn]) => ({ ...acc, [name]: fn(baseInputs) }),
    {}
  );
