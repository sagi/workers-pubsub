const fetchImpl = require('cross-fetch');
const WebCrypto = require('node-webcrypto-ossl');
const cryptoImpl = new WebCrypto();

(async () => {
  const PubSubREST = require('../');
  const serviceAccountJSON = require('./service_account.key.json');
  const PubSub = await PubSubREST({
    serviceAccountJSON,
    cryptoImpl,
    fetchImpl,
  });
  console.log(await PubSub.topics.list());
})();
