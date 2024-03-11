import { fetchUtils, HttpError } from "react-admin";
import { PREFIX } from "./authProvider";

const AUTH_API_URL = "/api/authentication";

const refreshToken = async () => {
  const response = await fetchUtils.fetchJson(`${AUTH_API_URL}/refresh`, {
    method: "POST",
    credentials: "include",
    headers: new Headers({ "Content-Type": "application/json" }),
  });
  if (response.status < 200 || response.status >= 300) {
    throw new Error("Unauthorized");
  }
  localStorage.setItem(`${PREFIX}-auth`, response.body);
};

async function httpClient(
  url: string,
  options?: fetchUtils.Options,
  transformMethod?: "json",
  iteration?: number
): Promise<{
  status: number;
  headers: Headers;
  body: string;
  json: any;
}>;
async function httpClient(
  url: string,
  options?: fetchUtils.Options,
  transformMethod?: "blob",
  iteration?: number
): Promise<Blob>;
async function httpClient(
  url: string,
  options: fetchUtils.Options = {},
  transformMethod: "json" | "blob" = "json",
  iteration: number = 0
): Promise<
  | {
      status: number;
      headers: Headers;
      body: string;
      json: any;
    }
  | Blob
> {
  if (!options.headers) {
    options.headers = new Headers({
      Accept: "application/json",
      "Content-Type": "application/json; charset=UTF-8",
    });
  }
  const auth = localStorage.getItem(`${PREFIX}-auth`);
  if (auth) {
    const { token } = JSON.parse(
      localStorage.getItem(`${PREFIX}-auth`) || "null"
    );
    (options.headers as any).set("Authorization", `Bearer ${token}`);
  }
  options.credentials = "include";
  try {
    switch (transformMethod) {
      case "json":
        return await fetchUtils.fetchJson(url, options);
      case "blob":
        const response = await fetch(url, options);
        return await response.blob();
      default:
        return await fetchUtils.fetchJson(url, options);
    }
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      if (error.status === 401 && error.body.message === "Token expired") {
        if (iteration >= 2) {
          return Promise.reject(error);
        }
        try {
          await refreshToken();
        } catch (error: unknown) {
          return Promise.reject(error);
        }
        if (transformMethod === "blob") {
          return await httpClient(url, options, transformMethod, iteration + 1);
        }
        return await httpClient(url, options, transformMethod, iteration + 1);
      }
    }
    return Promise.reject(error);
  }
}

export default httpClient;
