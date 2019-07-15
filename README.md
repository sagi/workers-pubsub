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

Instantiate a `PubSubREST` instance:

~~~js
import PubSubREST from '@sagi.io/cfw-pubsub'
const serviceAccountJSON = ...

const PubSub = new PubSubREST({ serviceAccountJSON })
~~~

### **`PubSub.topics.list({ ... })`**

### **`PubSub.topics.publish({ ... })`**

### **`PubSub.helpers.createPubSubMessage({ ... })`**
Function definition:

```js
const createPubSubMessage = ({
  message = '',
  attributes = undefined,
} = {}) => { ... }
```
Where:

  - **`message`** *optional* Your Cloudflare account id.
  - **`cfEmail`** *optional* The email you registered with Cloudflare.
 

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


## API

We adhere to [Cloudflare's Workers KV REST API](https://api.cloudflare.com/#cfw-pubsub-namespace-properties).

### **`WorkersKV({ ... })`**

Instantiates a `WorkersKV` object with the defined below methods.

Function definition:

```js
const WorkersKV = function({
  cfAccountId,
  cfEmail,
  cfAuthKey,
  namespaceId = '',
}){ ... }
```

Where:

  - **`cfAccountId`** *required* Your Cloudflare account id.
  - **`cfEmail`** *required* The email you registered with Cloudflare.
  - **`cfAuthKey`** *required* Your Cloudflare Auth Key.
  - **`namespaceId`** *optional* The `Workers KV` namespace id. This argument is *optional* - either provide it here, or via the methods below.

### **`listKeys({ ... })`**

Function definition:

```js
const listKeys = async ({
  namespaceId = '',
  limit = MAX_KEYS_LIMIT,
  cursor = undefined,
  prefix = undefined,
} = {}) => { ... }
```

Where:

  - **`namespaceId`** *optional* The namespace id (can also be provided while instantiating `WorkersKV`).
  - **`limit`** *optional* The number of keys to return. The cursor attribute may be used to iterate over the next batch of keys if there are more than the limit.
  - **`cursor`** *optional* Opaque token indicating the position from which to continue when requesting the next set of records if the amount of list results was limited by the limit parameter. A valid value for the cursor can be obtained from the cursors object in the result_info structure.
  - **`prefix`** *optional* A string prefix used to filter down which keys will be returned. Exact matches and any key names that begin with the prefix will be returned.

### **`listAllKeys({ ... })`**

Cursors through `listKeys` requests for you.

Function definition:

```js
const listAllKeys = async ({
  namespaceId = '',
  prefix = undefined,
  limit = MAX_KEYS_LIMIT,
} = {}) => { ... }
```

Where:

  - **`namespaceId`** *optional* The namespace id (can also be provided while instantiating `WorkersKV`).
  - **`cursor`** *optional* Opaque token indicating the position from which to continue when requesting the next set of records if the amount of list results was limited by the limit parameter. A valid value for the cursor can be obtained from the cursors object in the result_info structure.
  - **`prefix`** *optional* A string prefix used to filter down which keys will be returned. Exact matches and any key names that begin with the prefix will be returned.

### **`listNamespaces({ ... })`**

Function definition:

```js
const listNamespaces = async ({
  page = 1,
  per_page = 50,
} = {}) => { ... }
```

Where:

  - **`page`** *optional* Page number of paginated results.
  - **`per_page`** *optional* Maximum number of results per page.

### **`readKey({ ... })`**

Function definition:

```js
const readKey = async ({
  key,
  namespaceId = '',
}) => { ... }
```

Where:

  - **`key`** *required* the key name.
  - **`namespaceId`** *optional* The namespace id (can also be provided while instantiating `WorkersKV`).

### **`deleteKey({ ... })`**

Function definition:

```js
const deleteKey= async ({
  key,
  namespaceId = '',
}) => { ... }
```

Where:

  - **`key`** *required* the key name.
  - **`namespaceId`** *optional* The namespace id (can also be provided while instantiating `WorkersKV`).

### **`writeKey({ ... })`**

Function definition:

```js
const writeKey=> async ({
  key,
  value,
  namespaceId = '',
  expiration = undefined,
  expiration_ttl = undefined,
}) => { ... }
```

Where:

  - **`key`** *required* A key's name. The name may be at most 512 bytes. All printable, non-whitespace characters are valid.
  - **`value`** *required* A UTF-8 encoded string to be stored, up to 2 MB in length.
  - **`namespaceId`** *optional* Is the namespace id (can also be provided while instantiating `WorkersKV`).
  - **`expiration`** *optional* The time, measured in number of seconds since the UNIX epoch, at which the key should expire.
  - **`expiration_ttl`** *optional* The number of seconds for which the key should be visible before it expires. At least 60.

### **`writeMultipleKeys({ ... })`**

Function definition:

```js
const writeMultipleKeys => async ({
  keyValueMap,
  namespaceId = '',
  expiration = undefined,
  expiration_ttl = undefined,
}) => { ... }
```

Where:

  - **`keyValueMap`** *required* Is an object with string keys and values. e.g  `{ keyName1: 'keyValue1', keyName2: 'keyValue2' }`
  - **`namespaceId`** *optional* Is the namespace id (can also be provided while instantiating `WorkersKV`).
  - **`expiration`** *optional* The time, measured in number of seconds since the UNIX epoch, at which the key should expire.
  - **`expiration_ttl`** *optional* The number of seconds for which the key should be visible before it expires. At least 60.

### **`deleteMultipleKeys({ ... })`**

Function definition:

```js
const deleteMultipleKeys = async ({
  keys,
  namespaceId = '',
}) => { ... }
```

Where:

  - **`keys`** *required* An array of keys to be deleted.
  - **`namespaceId`** *optional* The namespace id (can also be provided while instantiating `WorkersKV`).
