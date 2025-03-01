import { message } from "antd";
import axios, { AxiosRequestConfig } from "axios";
import { getAccount, getToken } from "./token";
import { Result, ResultCode } from "./type";
import { nav } from "../common/utils";

/*
 * messgae 用于在前端显示全局消息提醒
 * axios 用于发送网络请求
 * getToken 用于获取当前账号的token
 * Result 定义了统一的返回值格式
 * ResultCode 定义了统一的返回码格式
 * nav 用于导航到指定URL
 */

// 定义当前的运行模式 dev 为开发模式，build 为生产模式
const model: "dev" | "build" = "dev";

// 根据不同的运行模式设置不同的请求前缀
const prefixMap = {
  dev: "http://localhost:12345",
  build: "http://localhost:12345",
};

// 通用的网络请求函数
export async function request(
  url: string,
  method: "GET" | "POST",
  data: { [key: string]: unknown } | FormData,
  headers?: { [key: string]: string | number },
): Promise<Result> {
  // 根据不同的模式设置不同的请求前缀
  url = prefixMap[model] + url;

  // 配置Axios请求参数
  let config: AxiosRequestConfig<
    | {
        [key: string]: unknown;
      }
    | FormData
  > = {
    url,
    method,
    withCredentials: true,
  };

  // 对于GET请求，将参数放在params中，对于POST请求，将参数放在data中
  if (method === "GET") {
    config.params = { ...data };
  } else {
    config.data = data;
  }

  // 设置请求头
  let h: { [key: string]: string | number } = {};
  if (headers) {
    h = { ...headers };
  }
  let token = getToken();
  let account = getAccount();

  if (token !== null && account !== null) {
    document.cookie = "account=" + account;
    h["token"] = token;
    // h["Authorization"] = "Bearer " + token;
  }

  config.headers = h;

  let res = await axios.request(config);
  if (res.status !== 200) {
    throw new Error("network request error");
  }

  // 发送请求并处理响应
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

// 封装GET和POST请求
export async function get(url: string, data: { [key: string]: unknown }): Promise<Result> {
  console.log("get", url, "data:", data);
  console.log("req.headers", Headers);
  return request(url, "GET", data);
}

export async function post(url: string, data: { [key: string]: unknown } | FormData): Promise<Result> {
  console.log("post", url, data);
  return request(url, "POST", data);
}
