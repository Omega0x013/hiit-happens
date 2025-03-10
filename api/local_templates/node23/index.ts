// Copyright (c) Alex Ellis 2021. All rights reserved.
// Copyright (c) OpenFaaS Author(s) 2021. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import handler from './function/handler';
import {FunctionContext, FunctionEvent} from './function/runtime';
import express, { Request } from 'express';
import bodyParser from 'body-parser';


const defaultMaxSize = '100kb' // body-parser default
const rawLimit: string = process.env.MAX_RAW_SIZE || defaultMaxSize
const jsonLimit: string = process.env.MAX_JSON_SIZE || defaultMaxSize

const app = express();

app.disable('x-powered-by');

app.use(function addDefaultContentType(req, res, next) {
    // When no content-type is given, the body element is set to 
    // nil, and has been a source of contention for new users.

    if(!req.headers['content-type']) {
        req.headers['content-type'] = "text/plain"
    }
    next()
})

if (process.env.RAW_BODY === 'true') {
    app.use(bodyParser.raw({ type: '*/*' , limit: rawLimit }))
} else {
    app.use(bodyParser.text({ type : "text/*" }));
    app.use(bodyParser.json({ limit: jsonLimit}));
    app.use(bodyParser.urlencoded({ extended: true }));
}

const isArray = (a: unknown) : a is Array<unknown> => {
    return (!!a) && (a.constructor === Array);
};

const isObject = (a: unknown) : a is Object => {
    return (!!a) && (a.constructor === Object);
};

const middleware = async (req, res) => {
    const cb = (err: unknown, functionResult?: unknown|undefined): void => {
      if (err) {
        console.error(err);
        return res.status(fnContext.status())
          .send(err.toString ? err.toString() : err);
      }

      if(isArray(functionResult) || isObject(functionResult)) {
        res.set(fnContext.headers())
          .status(fnContext.status()).send(JSON.stringify(functionResult));
      } else {
        res.set(fnContext.headers())
          .status(fnContext.status())
          .send(functionResult);
      }
    };

    const fnEvent = new FunctionEvent(req);
    const fnContext = new FunctionContext(cb);

    Promise.resolve(handler(fnEvent, fnContext, cb))
    .then(res => {
      if(!fnContext.getCbCalled()) {
        fnContext.succeed(res);
      }
    })
    .catch(e => {
      cb(e);
    });
};

app.post('/*', middleware);
app.get('/*', middleware);
app.patch('/*', middleware);
app.put('/*', middleware);
app.delete('/*', middleware);
app.options('/*', middleware);

const port = process.env.http_port || 3000;

app.listen(port, () => {
    console.log(`node23 listening on port: ${port}`)
});

