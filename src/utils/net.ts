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
  const headers = { ...request.headers };
  const method = request.method.toUpperCase();

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    headers["X-XSRF-TOKEN"] = getCookie("XSRF-TOKEN") ?? "";
  }

  let body: BodyInit | undefined;

  if (request.body instanceof FormData) {
    body = request.body;

  } else if (request.body != null) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(request.body);
  }

  const response = await fetch("/api" + request.url, {
    method,
    headers,
    credentials: "include",
    body,
  });

  return response;
}