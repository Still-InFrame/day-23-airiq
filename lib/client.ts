import type { ApiErrorKind } from "@/lib/types";

/** Client-side fetch wrapper. Turns API error envelopes into a typed error. */
export class ApiClientError extends Error {
  kind: ApiErrorKind;
  constructor(kind: ApiErrorKind, message: string) {
    super(message);
    this.name = "ApiClientError";
    this.kind = kind;
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path);
  } catch {
    throw new ApiClientError("network", "Network error.");
  }

  if (!res.ok) {
    let kind: ApiErrorKind = "server";
    let message = "Request failed.";
    try {
      const body = (await res.json()) as { error?: { kind?: ApiErrorKind; message?: string } };
      if (body?.error?.kind) kind = body.error.kind;
      if (body?.error?.message) message = body.error.message;
    } catch {
      /* non-JSON error response */
    }
    throw new ApiClientError(kind, message);
  }

  return (await res.json()) as T;
}
