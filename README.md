# Feathers Debugger Service

> Debugger service for [Feathers Debugger](https://github.com/radenkovic/feathers-debugger).

## Intro

Feathers debugger service exposes (/feathers-debugger) endpoint that can be used.

## Installation

Install package with:

`yarn add feathers-debugger-service`

## Register Service

Register the service in `app.js` or `services/index.js`.

```js
// app.js
const debuggerService = require('feathers-debugger-service');

const app = express(feathers());
app.configure(services);
app.hooks(hooks);

if (process.env.NODE_ENV !== 'production') // enable it only on development
  app.configure(debuggerService({
    expireAfterSeconds: 10,  // optional, default is 900 (15 minutes)
    filename: 'debugger.db' // optional, if you want to persist data in file (uses feathers-nedb)
  }));
```


## Add trace() to Hooks

If you want to trace all requests, add it to `app.hooks`. You can also add it manually to only certain services you want to trace.

```js
// app.hooks.js
const { trace } = require('feathers-debugger-service');
module.exports = {
  before: {
    all: [
      trace(),  // < ----- in before "all" (first item)
      // ...
    ],
  },
  // ...
  finally: {
    all: [
      trace() // < ------- in finally "all" (last item) MUST be included!
    ],
  },
};
```


## Options


Service configuration options

```js
app.configure(debuggerService({
  expireAfterSeconds: 900, // Expire item in storage after x seconds, default is 900 (optional)
  filename: 'nedb.db', // set filename if you want to persist data (optional)
  ui: true // if you want to expose UI on publicUrl (default is false) and debug without chrome extension
  publicUrl: '/debugger' // set custom url for debugger (default is /debugger), used only if ui: true
}))
```


```js
// hooks
trace({
  captureParams: true,  // captures hook.params, default is false (optional)
  captureResult: true,  // captures hook.result, default is false (optional)
  captureQuery: true // captures hook.params.query, default is false (optional)
})
```

## Deploy to npm

Manually bump `package.json`, then push with exact version:

```bash
git commit -m "Release 1.0.1"
```
