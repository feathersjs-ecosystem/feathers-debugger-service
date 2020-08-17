const packageJson = require('../package.json');

module.exports = ({ Model }) => ({
  before: {
    find: [
      (ctx) => {
        // Can be used later to specify version for response
        // if (ctx.params.query.$version !== '1.2.0')
        //   throw new Error('version-not-supported');
        delete ctx.params.query.$version; // client version

        // Convert ts[$gt] to number
        if (ctx.params.query.ts && ctx.params.query.ts.$gt) {
          ctx.params.query.ts.$gt = Number(ctx.params.query.ts.$gt);
        }
      },
    ],
    remove: [
      async (ctx) => {
        await Model.remove({}, { multi: true });
        ctx.result = { success: true };
      },
    ],
  },
  after: {
    find: [
      (ctx) => {
        ctx.result = {
          service_version: packageJson.version,
          data: ctx.result,
        };
      },
    ],
  },
});
