import { getCookie } from "@/lib/utils";

export class FetchRequest {
  constructor(
    public url: string = "",
    public method: string = "GET",
    public headers: Record<string, string> = {},
    public body: unknown | null = null,
  ) {}
}

export async function fetchService(request: FetchRequest): Promise<Response> {
  const startTime = Date.now();

  const headers = { ...request.headers };
  const method = request.method.toUpperCase();

  if (request.body !== null) {
    headers["Content-Type"] = "application/json";
  }

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    headers["X-XSRF-TOKEN"] = getCookie("XSRF-TOKEN") ?? "";
  }

  const response = await fetch("/api" + request.url, {
    method: method,
    headers,
    credentials: "include",
    body: request.body !== null ? JSON.stringify(request.body) : undefined,
  });

  console.debug(`Request took ${Date.now() - startTime}ms`);

  return response;
}