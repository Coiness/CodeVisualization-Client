import { post } from "./request";
import { setAccount, setToken } from "./token";

export async function register(account: string, pwd: string): Promise<boolean> {
  let r = await post("/user/register", { account, pwd });
  return r.flag;
}

export async function login(account: string, pwd: string): Promise<boolean> {
  let r = await post("/user/login", { account, pwd });
  if (r.flag) {
    setAccount(account);
    setToken(r.data.token);
  }
  return r.flag;
}

export async function getUserInfo() {}

export async function modifyUsername() {}
