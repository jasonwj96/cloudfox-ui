import { getCookie } from "@/lib/utils";

export class FetchRequest {
  constructor(
    public url?: URL,
    public method: string = "GET",
    public headers: Record<string, string> = {},
    public body: unknown = null
  ) {}
}

export class Net {
  static async fetchService(request: FetchRequest) {
    const startTime = Date.now();

    await fetch("/api/auth/csrf", {
      method: "GET",
      credentials: "include",
    });

    const csrfToken = getCookie("XSRF-TOKEN");

    const headers = {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": csrfToken ?? "",
      ...request.headers,
    };

    const response = await fetch(request.url.toString(), {
      method: request.method,
      headers,
      credentials: "include",
      body:
        request.body !== null
          ? JSON.stringify(request.body)
          : undefined,
    });

    console.log(`Request took ${Date.now() - startTime}ms`);

    return response;
  }
}