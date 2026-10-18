type CacheEntry = {
  value: unknown;
  expiresAt: number;
};

type PendingRequest = {
  token: symbol;
  promise: Promise<unknown>;
};

const cache = new Map<string, CacheEntry>();
const pendingRequests = new Map<string, PendingRequest>();

export function getCachedRequest<T>(
  key: string,
  load: () => Promise<T>,
  ttlMs = 30_000,
  forceFresh = false,
): Promise<T> {
  const cached = cache.get(key);
  if (!forceFresh && cached && cached.expiresAt > Date.now()) {
    return Promise.resolve(cached.value as T);
  }

  const pending = pendingRequests.get(key);
  if (!forceFresh && pending) {
    return pending.promise as Promise<T>;
  }

  const token = Symbol(key);
  const promise = load()
    .then((value) => {
      if (pendingRequests.get(key)?.token === token) {
        cache.set(key, { value, expiresAt: Date.now() + ttlMs });
      }
      return value;
    })
    .finally(() => {
      if (pendingRequests.get(key)?.token === token) {
        pendingRequests.delete(key);
      }
    });

  pendingRequests.set(key, { token, promise });
  return promise;
}

export function invalidateCachedRequests(prefix: string): void {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key);
  }
  for (const key of pendingRequests.keys()) {
    if (key.startsWith(prefix)) pendingRequests.delete(key);
  }
}
