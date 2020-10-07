import { Application, HookContext } from '@feathersjs/feathers';

export interface DebuggerServiceOptions {
  /**
   * Expire item in storage after x seconds (default is 900)
   */
  expireAfterSeconds?: number;
  /**
   * Define filename if want to persist data to file (uses feathers-nedb)
   */
  filename?: string;
  /**
   * Whether to expose UI on publicUrl (default is false) and debug without chrome extension
   */
  ui?: boolean;
  /**
   * If UI is exposed, define custom url for debugger (default is /debugger)
   */
  publicUrl?: string;
}

declare const debuggerService: (options?: DebuggerServiceOptions) => (app: Application) => void;

export interface TraceHookOptions {
  /**
   * Captures hook.params (default is false)
   */
  captureParams?: boolean;
  /**
   * Captures hook.result (default is false)
   */
  captureResult?: boolean;
  /**
   * Captures hook.params.query (default is false)
   */
  captureQuery?: boolean;
}

export const trace: (options?: TraceHookOptions) => (context: HookContext) => Promise<HookContext>;

export default debuggerService;
