
const MAX_RETRIES = 6;
const retryOn = new RegExp([
  'Network connection lost',
  'Cannot resolve Durable Object due to transient issue on remote node',
  'Durable Object reset because its code was updated',
  'The Durable Object\'s code has been updated',
].join('|'));

export type Fetch = typeof fetch;

export function retryWhenNeeded(fetch: Fetch, input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> {
  let retries = 0;

  async function onCatch(err: any): Promise<Response> {
    if (!shouldRetry(err, retries)) return Promise.reject(err);
    // Retry up to 11 times over 30 seconds with exponential backoff. 20ms, 40ms, etc
    await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 10));
    return fetch(input, init).catch(onCatch);
  }

  return fetch(input, init).catch(onCatch);
}

function shouldRetry(err: any, retries: number) {
  if (retries > MAX_RETRIES) return false;
  return retryOn.test(err + '');
}
