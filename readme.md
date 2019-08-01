# Ajiax
node simple request.

```
npm install --save @cray/ajiax
```

## use


```js
const ajiax = require('@cray/ajiax');

ajiax.get();
ajiax.post();
```

return `Promise`.

### get({uri,resolveWithFullResponse,encoding,headers,query , timeout})

* uri : get requset url.
* resolveWithFullResponse : only return success or error data if `resolveWithFullResponse = false`. default `false`.
* headers : request header.
* query : url query data , type : Object.
* timeout: number | 15000.

### get(uri)

### post({uri,resolveWithFullResponse,encoding,headers,query,body,timeout})

* uri : post requset url.
* resolveWithFullResponse : only return success or error data if `resolveWithFullResponse = false`. default `false`.
* headers : request header.
* query : url query data , type : Object.
* body : post's data , type : Object.
* timeout: number | 15000

### post(url)