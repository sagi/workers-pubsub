import 'cross-fetch/polyfill';
import * as topicsOps from './topics';
import { getTokenFromGCPServiceAccount } from '@sagi.io/cfw-jwt';
import { createPubSubMessage, setGlobals, injectBaseinputs } from './utils';

const WebCrypto = require('node-webcrypto-ossl');
const cryptoImpl = new WebCrypto();

export const PubSubREST = async ({
  serviceAccountJSON,
  cryptoImpl = null,
  fetchImpl = null,
}) => {
  setGlobals(fetchImpl);

  const { project_id: projectId } = serviceAccountJSON;
  const aud = 'https://pubsub.googleapis.com/google.pubsub.v1.Publisher';

  const token = await getTokenFromGCPServiceAccount({
    serviceAccountJSON,
    aud,
    cryptoImpl,
  });

  const headers = { Authorization: `Bearer ${token}` };
  const baseUrl = `https://pubsub.googleapis.com/v1`;
  const baseInputs = { headers, projectId, baseUrl };

  const topics = injectBaseinputs(baseInputs, topicsOps);
  const helpers = { createPubSubMessage };

  const PubSub = { topics, helpers };
  return PubSub;
};

(async () => {
  const serviceAccountJSON = require('../service_account.key.json');
  const PubSub = await PubSubREST({ serviceAccountJSON, cryptoImpl });
  console.log(await PubSub.topics.get({ topic: 'cfw-task' }));
  //const result = await PubSub.topics.list();
  //console.log(result);
})();
