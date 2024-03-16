const MAX_RETRIES = 6;
const retryOn = new RegExp([
    'Network connection lost',
    'Cannot resolve Durable Object due to transient issue on remote node',
    'Durable Object reset because its code was updated',
    'The Durable Object\'s code has been updated',
].join('|'));
export function retryWhenNeeded(fetch, input, init) {
    let retries = 0;
    async function onCatch(err) {
        if (!shouldRetry(err, retries))
            return Promise.reject(err);
        // Retry up to 11 times over 30 seconds with exponential backoff. 20ms, 40ms, etc
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 10));
        return fetch(input, init).catch(onCatch);
    }
    return fetch(input, init).catch(onCatch);
}
function shouldRetry(err, retries) {
    if (retries > MAX_RETRIES)
        return false;
    return retryOn.test(err + '');
}
//# sourceMappingURL=index.js.map