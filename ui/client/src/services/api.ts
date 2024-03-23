import { getLocalItem } from "../utils";
import { IServerReponse } from "../interfaces/response.interface";

const baseURL = process.env.API_URL || "http://localhost:8080/api/v1";

export default class fetcher {
  static getDefaultHeaders() {
    return;
  }

  static fetch = async <T>(url: string, options?: RequestInit) => {
    let accessToken = getLocalItem("accessToken") || "";
    let refreshToken = getLocalItem("refreshToken") || "";
    const clientId = getLocalItem("user")?.id || "";

    const res = await fetch(`${baseURL}${url}`, {
      method: options?.method || "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
        "x-refresh-token": refreshToken,
        "x-client-id": clientId,
        ...options?.headers,
      },
      cache: "default",
      next: {
        revalidate: 10,
      },
      ...options,
    });

    const json: IServerReponse<T> = await res.json();

    if (!res.ok) throw new Error(json.message || "Something went wrong");

    return json;
  };

  static get<T>(url: string) {
    return this.fetch<T>(url, {
      method: "GET",
    });
  }

  static post<T>(url: string, data?: any) {
    return this.fetch<T>(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static delete<T>(url: string) {
    return this.fetch<T>(url, {
      method: "DELETE",
    });
  }
}
