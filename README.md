# cfw-pubsub

[`@sagi.io/cfw-pubsub`](https://www.npmjs.com/package/@sagi.io/cfw-pubsub) is a Google Pub/Sub REST API for Cloudflare Workers (can also be used with Node).

[![CircleCI](https://circleci.com/gh/sagi/cfw-pubsub.svg?style=svg&circle-token=c5ae7a8993d47db9ca08a628614585ca45c75f33)](https://circleci.com/gh/sagi/cfw-pubsub)
[![MIT License](https://img.shields.io/npm/l/@sagi.io/cfw-pubsub.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![version](https://img.shields.io/npm/v/@sagi.io/cfw-pubsub.svg?style=flat-square)](http://npm.im/@sagi.io/cfw-pubsub)

## Installation

~~~
$ npm i @sagi.io/cfw-pubsub
~~~

## API

We follow [Google's Pub/Sub REST API](https://cloud.google.com/pubsub/docs/reference/rest/) specification. We'll add more methods if there's demand.

See below for concrete examples for Cloudflare Workers and Node.js.

### **`PubSubREST({ ... })`**

Instantiates `PubSub` instance.

Function definition:

```js
 const PubSubREST = async ({
  serviceAccountJSON,
  cryptoImpl = null,
  fetchImpl = null,
}) => { ... }
```
Where:

  - **`serviceAccountJSON`** *required* Is a Google Cloud service account with a **Pub/Sub Admin** role. An object.
  - **`cryptoImpl`** *optional* Not needed when running on Cloudflare Workers. See concrete example below for how to use it with Node.js.
  - **`fetchImpl`** *optional* Not needed when running on Cloudflare Workers. See concrete example below for how to use it with Node.js.

### **`PubSub.topics.publish({ ... })`**

Publishes a message to a topic.

Function definition:

```js
const publish = ({ topic, messages } = {}) => { ... }
```
Where:

  - **`topic`** *required* The topic to send messages to.
  - **`messages`** *required* an array of [Pub/Sub messages](https://cloud.google.com/pubsub/docs/reference/rest/v1/PubsubMessage). You can use the `PubSub.helpers.createPubSubMessage` method to easily create a Pub/Sub message.

### **`PubSub.topics.list({ ... })`**

Lists all topics.

### **`PubSub.helpers.createPubSubMessage({ ... })`**
Helps create a PubSub message easily.

Function definition:

```js
const createPubSubMessage = ({ message = '', attributes = undefined } = {}) => { ... }
```
Where:

  - **`message`** *optional* A message string. e.g. `Hello World`.
  - **`attributes`** *optional* An object with string values. e.g. `{ type: 'slack-poll' }`.

Returns a [Pub/Sub message](https://cloud.google.com/pubsub/docs/reference/rest/v1/PubsubMessage).

## Cloudflare Workers Example

~~~js
import base64url from 'base64url'
import PubSubREST from '@sagi.io/cfw-pubsub'

const serviceAccountJSON = ...

const PubSub = await PubSubREST({ serviceAccountJSON })

const topic = 'gcf-task'
const psMessage = PubSub.createPubSubMessage({ message: 'Hello World!' })
const messages = [ psMessage ]

await PubSub.topics.publish({ topic, messages })
~~~

## Node.js Example

~~~js
import fetchImpl from 'cross-fetch'
import WebCrytpo from 'node-webcrypto-ossl'
import PubSubREST from '@sagi.io/cfw-pubsub'

const cryptoImpl = new WebCrypto()

const serviceAccountJSON = ...

const PubSub = await PubSubREST({ serviceAccountJSON, cryptoImpl. fetchImpl })

const topic = 'gcf-task'
const psMessage = PubSub.helpers.createPubSubMessage({ message: 'Hello World!' })
const messages = [ psMessage ]

await PubSub.topics.publish({ topic, messages })
~~~
