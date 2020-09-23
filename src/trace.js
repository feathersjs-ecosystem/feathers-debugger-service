module.exports = (
  options = { captureParams: false, captureResult: false, captureQuery: false }
) => async (ctx) => {
  const service = ctx.app.service('feathers-debugger');

  // Skip the hook if service is not registered
  if (!service) {
    return;
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
    data: JSON.stringify(ctx.data),
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
