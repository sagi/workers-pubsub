import * as topicsOps from './topics';
import { getTokenFromGCPServiceAccount } from '@sagi.io/workers-jwt';
import { createPubSubMessage, setGlobals, injectBaseInputs } from './utils';

const PubSubREST = async ({
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

  const topics = injectBaseInputs(baseInputs, topicsOps);
  const helpers = { createPubSubMessage };

  const PubSub = { topics, helpers };
  return PubSub;
};

module.exports = PubSubREST;
