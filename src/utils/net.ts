import { getCookie } from "@/lib/utils";

export class FetchRequest {
  constructor(
    public url: string = "",
    public method: string = "GET",
    public headers: Record<string, string> = {},
    public body: unknown = null,
  ) {}
}

export async function fetchService(request: FetchRequest): Promise<Response> {
  const startTime = Date.now();

  await fetch("/api/security/csrf-token", {
    method: "GET",
    credentials: "include",
  });

  const csrfToken = getCookie("XSRF-TOKEN");

  const headers = {
    "X-XSRF-TOKEN": csrfToken ?? "",
    ...request.headers,
  };

  const response = await fetch("/api"  + request.url, {
    method: request.method,
    headers,
    credentials: "include",
    body: request.body !== null ? JSON.stringify(request.body) : undefined,
  });

  console.debug(`Request took ${Date.now() - startTime}ms`);

  return response;
}
