# Ajiax
node simple request.


## use

```js
const ajiax = require('ajiax');

ajiax.get();
ajiax.post();
```

return `Promise`.

> please don't use this download max size file.


### get({url,resolveWithFullResponse,encoding,headers,query,data})

* url : get requset url.
* resolveWithFullResponse : only return success or error data if `resolveWithFullResponse = false`. default `false`.
* encoding : response encode. default `utf-8`.
* headers : request header.
* query : url query data , type : Object.
* data : null.

### get(url)

### post({url,resolveWithFullResponse,encoding,headers,query,data})

* url : post requset url.
* resolveWithFullResponse : only return success or error data if `resolveWithFullResponse = false`. default `false`.
* encoding : response encode. default `utf-8`.
* headers : request header.
* query : url query data , type : Object.
* data : post's data , type : Object.

### post(url)