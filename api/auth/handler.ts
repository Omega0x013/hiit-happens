import { FunctionContext, FunctionEvent } from './runtime.ts';

export default async function handler(
  event: FunctionEvent, 
  context: FunctionContext, 
  callback: (err: unknown, succ?: unknown|undefined) => void
): Promise<unknown> {
  return {};
}