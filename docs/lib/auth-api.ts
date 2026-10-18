type AuthApiResponse = {
  detail?: string;
  message?: string;
};

export type AuthenticatedAccount = {
  id: string;
  phone: string;
  email: string | null;
  learners: {
    id: string;
    display_name: string;
    grade_id: string | null;
  }[];
};

let cachedAccount: AuthenticatedAccount | undefined;

export function getCachedAccount(): AuthenticatedAccount | undefined {
  return cachedAccount;
}

export function setCachedAccount(account: AuthenticatedAccount): void {
  cachedAccount = account;
}

export function clearCachedAccount(): void {
  cachedAccount = undefined;
}

export class AuthApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "AuthApiError";
  }
}

const AUTH_API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1"
).replace(/\/+$/, "");

export async function authApiRequest<T extends object = AuthApiResponse>(
  path: string,
  options: { method?: "GET" | "POST"; body?: unknown } = {},
): Promise<T> {
  const response = await fetch(`${AUTH_API_URL}/auth/${path}`, {
    method: options.method ?? "GET",
    credentials: "include",
    headers: options.body === undefined ? undefined : { "Content-Type": "application/json" },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  const result = (await response.json().catch(() => ({}))) as AuthApiResponse & T;

  if (!response.ok) {
    throw new AuthApiError(result.detail ?? `Request failed (${response.status}).`, response.status);
  }
  return result as T;
}
