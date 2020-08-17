const NeDB = require('nedb');
const service = require('feathers-nedb');
const traceHook = require('./trace');
const hooks = require('./hooks');

const configureService = (options = {}) => (app) => {
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
};

module.exports = configureService;
module.exports.trace = traceHook;
