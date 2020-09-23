const NeDB = require('nedb');
const service = require('feathers-nedb');
const traceHook = require('./trace');
const hooks = require('./hooks');
const path = require('path');
const express = require('@feathersjs/express'); // eslint-disable-line

const configureService = (options = { ui: false, publicUrl: '/debugger' }) => (
  app
) => {
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
    expireAfterSeconds: options.expireAfterSeconds || 900, // 15 min
  });

  app.use('/feathers-debugger', service({ Model }));
  app.service('feathers-debugger').hooks(hooks({ Model }));
  // Expose UI on endpoint if ui: true
  if (options.ui) {
    const publicUrl = options.publicUrl || '/debugger';
    const target = path.join(__dirname, '../../feathers-debugger/dist');
    console.log('✨ Feathers Debugger exposed on:', publicUrl);
    app.use(publicUrl, express.static(target));
  }
};

module.exports = configureService;
module.exports.trace = traceHook;
