module.exports = (
  options = { captureParams: false, captureResult: false, captureQuery: false }
) => async (ctx) => {
  const service = ctx.app.service('feathers-debugger');

  // Error Message if service is not registered
  if (!service) {
    return console.warn(
      'WARN: Service feathers-debuger is not registered, feathers debugger tracing is disabled. Please check Feathers Debugger documentation on how to setup: https://github.com/radenkovic/feathers-debugger.'
    );
  }
  if (ctx.path === 'feathers-debugger') return;

  if (!ctx._req_ts) {
    ctx._req_ts = Date.now();
    if (!ctx.params.provider) {
      // Add artificial 1ms
      ctx._req_ts += 1;
    }
  } else {
    ctx._req_duration = Date.now() - ctx._req_ts;
  }

  const payload = {
    id: ctx._req_id,
    path: options.path || ctx.path,
    type: ctx.type,
    method: ctx.method,
    provider: ctx.params ? ctx.params.provider : undefined,
    ts: ctx._req_ts,
    duration: ctx._req_duration,
    data: ctx.data,
    error: ctx.error ? ctx.error.message : undefined,
    end: Date.now(),
  };
  if (options.captureParams) payload.result = JSON.stringify(ctx.result);
  if (options.captureResult) payload.params = JSON.stringify(ctx.params);
  if (options.captureQuery) payload.query = JSON.stringify(ctx.params.query);

  if (payload.duration) {
    await service.create(payload);
  }
};
