import { message } from "antd";
import axios, { AxiosRequestConfig } from "axios";
import { getToken } from "./token";
import { Result, ResultCode } from "./type";
import { nav } from "../common/utils";

const model: "dev" | "build" = "dev";

const prefixMap = {
  dev: "",
  build: "",
};

export async function request(
  url: string,
  method: "GET" | "POST",
  data: { [key: string]: unknown } | FormData,
  headers?: { [key: string]: string | number },
): Promise<Result> {
  url = prefixMap[model] + url;
  let config: AxiosRequestConfig<
    | {
        [key: string]: unknown;
      }
    | FormData
  > = {
    url,
    method,
  };

  if (method === "GET") {
    config.params = { ...data };
  } else {
    config.data = data;
  }

  let h: { [key: string]: string | number } = {};
  if (headers) {
    h = { ...headers };
  }
  let token = getToken();
  if (token !== null) {
    h.token = token;
  }

  config.headers = h;

  let res = await axios.request(config);
  if (res.status !== 200) {
    throw new Error("network request error");
  }

  let r = res.data;
  if (r.code !== ResultCode.Success) {
    console.log("请求失败", { ...r });
    message.error(r.message);
    if (r.code === ResultCode.NoLogin) {
      nav("/");
    }
  }
  return r;
}

export async function get(url: string, data: { [key: string]: unknown }): Promise<Result> {
  return request(url, "GET", data);
}

export async function post(url: string, data: { [key: string]: unknown } | FormData): Promise<Result> {
  return request(url, "POST", data);
}
