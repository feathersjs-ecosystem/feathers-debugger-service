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

// enable it only on development
if (process.env.NODE_ENV !== 'production') {
  // the service comes with default options predefined,
  // you can override it if you wish to, see Options below
  app.configure(debuggerService());
}
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
  /**
   * Expire item in storage after 900 seconds (15 min)
   */
  expireAfterSeconds: 900,
  /**
   * Set filename if you want to persist data (uses feathers-nedb)
   */
  filename: 'nedb.db',
  /**
   * If you want to expose UI on publicUrl and debug without chrome extension
   */
  ui: false,
  /**
   * Set custom url for debugger, used only if ui is `true`
   */
  publicUrl: '/debugger'
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
git commit -m "Release 1.3.6"
```
