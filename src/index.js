const NeDB = require('nedb');
const service = require('feathers-nedb');
const traceHook = require('./trace');
const hooks = require('./hooks');
const path = require('path');
const express = require('@feathersjs/express');

const defaultOptions = {
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
}

const configureService = (options = defaultOptions) => (
  app
) => {
  options = Object.assign(defaultOptions, options);

  // Create a NeDB instance
  const Model = new NeDB({
    filename: options.filename,
    autoload: true,
    timestampData: true,
    multi: ['remove'],
    whitelist: ['$gt'],
  });

  Model.ensureIndex({
    fieldName: 'createdAt',
    expireAfterSeconds: options.expireAfterSeconds,
  });

  app.use('/feathers-debugger', service({ Model }));
  app.service('feathers-debugger').hooks(hooks({ Model }));
  // Expose UI on endpoint if ui: true
  if (options.ui) {
    const target = path.join(__dirname, '../../feathers-debugger/dist');
    console.log('✨ Feathers Debugger exposed on:', options.publicUrl);
    app.use(options.publicUrl, express.static(target));
  }
};

module.exports = configureService;
module.exports.trace = traceHook;
