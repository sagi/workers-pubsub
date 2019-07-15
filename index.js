require('cross-fetch/polyfill');
const WebCrypto = require('node-webcrypto-ossl');
const cryptoImpl = new WebCrypto();

const ERR_PREFIX = `@sagi.io/cfw-pubsub`;

const { getTokenFromGCPServiceAccount } = require('@sagi.io/cfw-jwt');

// https://cloud.google.com/pubsub/docs/reference/rest/v1/PubsubMessage
const createPubSubMessage = ({ message = '', attributes = null } = {}) => {
  if (!message && !attributes) {
    throw new Error(
      `${ERR_PREFIX}: must either have a non-empty message field or at least one attribute.`
    );
  }
};

const listTopics = baseInputs => async () => {
  const { headers, projectId, baseUrl } = baseInputs;
  const method = 'GET';
  const url = `${baseUrl}/projects/${projectId}/topics`;
  const response = await fetch(url, { method, headers });
  const { topics } = await response.json();
  return topics;
};

const publishToTopic = baseInputs => async ({ topic }) => {
  const { headers, projectId, baseUrl } = baseInputs;

  const method = 'POST';
  const url = `${baseUrl}/projects/${projectId}/topics/${topic}:publish`;
  const data = Buffer.from('hey hey').toString('base64');
  const bodyJSON = {
    messages: [
      {
        data,
        messageId: '12',
        publishTime: new Date().toISOString(),
      },
    ],
  };
  const body = JSON.stringify(bodyJSON);

  const response = await fetch(url, { method, headers, body });
  const resBody = await response.text();
};

const PubSubREST = async ({
  serviceAccountJSON,
  cryptoImpl = null,
  fetchImpl = null,
}) => {
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
  const topics = await listTopics(baseInputs)();
  console.log(topics);
  //const url = `/projects/${projectId}/topics/cfw-task:publish`;
};

(async () => {
  const serviceAccountJSON = require('./anon-dvlp-blank-role.json');
  await PubSubREST({ serviceAccountJSON, cryptoImpl });
  //const url = `https://pubsub.googleapis.com/v1/projects/${projectId}/topics`;
  /*
  const data = Buffer.from('hey hey').toString('base64');
  const bodyJSON = {
    messages: [
      {
        data,
        messageId: '12',
        publishTime: new Date().toISOString(),
      },
    ],
  };
  const body = JSON.stringify(bodyJSON);

  const response = await fetch(url, { method, headers, body });
  const resBody = await response.text();
  console.log(resBody);
  */
})();
