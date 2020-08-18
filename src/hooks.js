const packageJson = require('../package.json');

const quantile = (sorted, q) => {
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  } else {
    return sorted[base];
  }
};

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
        const sortedDuration = [...ctx.result]
          .sort((a, b) => a.duration - b.duration)
          .map((x) => x.duration);
        ctx.result = {
          stats: {
            p90: quantile(sortedDuration, 0.9),
            p95: quantile(sortedDuration, 0.95),
          },
          service_version: packageJson.version,
          data: ctx.result,
        };
      },
    ],
  },
});
