export type Fetch = typeof fetch;
export declare function retryWhenNeeded(fetch: Fetch, input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response>;
