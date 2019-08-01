'use strict';

/*global Buffer */
const http = require('http');
const https = require('https');
const { URL } = require('url');
const querystring = require('querystring');

const REQUEST_TIMEOUT = 15 * 1000;

/**
 * [getHostInformation 获取对应url数据信息]
 * @param  {String} sourceUri [description]
 * @return {[type]}           [description]
 */
function getHostInformation( sourceUri = '' ) {
    let uri = new URL(sourceUri);

    let protocol = uri.protocol || 'http:';
    let auth = uri.auth || '';
    let hostname = uri.hostname;
    let port = protocol === 'https:' ? uri.port || 443 : uri.port || 80;
    let pathname = uri.pathname || '/';
    let query = '';
    if ( uri.search ){
        query = uri.search.replace(/^\?/,'');
    }
    query = querystring.parse(query);
    return {protocol , auth , hostname , port , pathname , query};
}

/**
 * [getRealPath 获取请求path参数]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function getRealPath( options ){
    let query = querystring.stringify(options.query);
    return options.pathname + (query ? ('?' + query) : '');
}

/**
 * [getOptions 获取options]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function getOptions( options ) {
    return typeof options === 'string' ? getHostInformation(options) : getMergeOptions(options);
}

/**
 * [getMergeOptions 根据options获取options]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function getMergeOptions( options = {} ) {
    let uris = getHostInformation(options.uri);

    let body = options.body || {};
    let resolveWithFullResponse = !!options.resolveWithFullResponse || false;
    let query = options.query || {};
    query = Object.assign({} , uris.query , options.query);
    
    let headers = options.headers || {};
    let timeout = options.timeout || REQUEST_TIMEOUT;

    return options = Object.assign({} , uris , {headers , resolveWithFullResponse , body , query , timeout});
}

/**
 *[setCommonOptions 设置参数]
 *
 * @param {*} options
 * @param {string} [method='get']
 * @param {*} [headers={}]
 * @returns
 */
function setCommonOptions( options , method = 'get' , headers = {} ) {
    options.method = method;
    
    options.path = getRealPath(options);
    
    options.headers = Object.assign({} , headers , options.headers);
    
    if ( method === 'post' ){
        options.body = JSON.stringify(options.body);
        options.headers['Content-Length'] = Buffer.byteLength(options.body);
    }
    return options;
}

/**
 * [setPostOption 设置post参数]
 * @param {[type]} options [description]
 */
function setPostOption( options ) {
    options = getOptions(options);
    
    let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    
    return setCommonOptions(options , 'post' , headers);
}

/**
 * [setGetOptions 设置get参数]
 * @param {[type]} options [description]
 */
function setGetOptions(options) {
    return setCommonOptions(getOptions(options) , 'get');
}

/**
 * [handlerResponse 请求成功]
 * @param  {[type]}  response [description]
 * @param  {[type]}  body     [description]
 * @param  {Boolean} isFull   [description]
 * @return {[type]}           [description]
 */
function handlerResponse(response , body , isFull){
    return Promise.resolve(isFull ? Object.assign({} , response , {body}) : body);
}

/**
 * [requestPromise 请求]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function requestPromise(options) {
    let rq = options.protocol === 'https:' ? https : http;
    return new Promise((resolve , reject)=>{
        let req = rq.request(options, (res) => {
            let {statusCode} = res;
            //返回不是200
            if ( statusCode !== 200 ){
                return reject({code: statusCode , message:new Error(`request error. statusCode == ${statusCode}`)});
            }

            let arr = [];
            let len = 0;
            res.on('data', (chunk) => {
                len += chunk.length;
                arr.push(Buffer.from(chunk));
            });
            res.on('end', () => {
                //正确 success
                return resolve(handlerResponse(res , Buffer.concat(arr , len) , options.resolveWithFullResponse));
            });
        });
        req.setTimeout(options.timeout , ()=>{
            let err = new Error('request timeout.');
            err.code = 'ESOCKETTIMEDOUT';
            err.connect = false;
            req.abort();
            req.emit('error', err);
        });
        //请求出错
        req.on('error', (err) => {
            return reject(err);
        });
        //post写数据
        if ( options.method === 'post' && options.body ){
            req.write(options.body);
        }
        req.end();
    });
}

const ajiax = {};

//{uri,resolveWithFullResponse,headers,query,body}
ajiax.post = (options)=>{
    return requestPromise(setPostOption(options));
};
//{uri,resolveWithFullResponse,headers,query}
ajiax.get = (options)=>{
    return requestPromise(setGetOptions(options));
};

module.exports = ajiax;