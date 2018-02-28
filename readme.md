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

> please don't use this download max size file.


### get({url,resolveWithFullResponse,encoding,headers,query,data , timeout})

* url : get requset url.
* resolveWithFullResponse : only return success or error data if `resolveWithFullResponse = false`. default `false`.
* encoding : response encode. default `utf-8`.
* headers : request header.
* query : url query data , type : Object.
* data : null.
* timeout: number | 15000.

### get(url)

### post({url,resolveWithFullResponse,encoding,headers,query,data,timeout})

* url : post requset url.
* resolveWithFullResponse : only return success or error data if `resolveWithFullResponse = false`. default `false`.
* encoding : response encode. default `utf-8`.
* headers : request header.
* query : url query data , type : Object.
* data : post's data , type : Object.
* timeout: number | 15000

### post(url)