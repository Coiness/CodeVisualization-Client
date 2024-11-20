import { nowAccount } from "../store";

const TokenKey = "DSV_TOKEN";
const AccountKey = "DSV_ACCOUNT";

// 获取 token
export function getToken(): string | null {
  return window.localStorage.getItem(TokenKey);
}

// 设置 token
export function setToken(token: string) {
  window.localStorage.setItem(TokenKey, token);
}

// 获取账号
export function getAccount(): string | null {
  return window.localStorage.getItem(AccountKey);
}

// 设置账号
export function setAccount(account: string) {
  window.localStorage.setItem(AccountKey, account);
  nowAccount.set(account);
}

// 清除账户和令牌
export function clear() {
  window.localStorage.removeItem(AccountKey);
  window.localStorage.removeItem(TokenKey);
  nowAccount.set(null);
}

// 检查登录状态
export function isLogin(): boolean {
  return getAccount() !== null && getToken() != null;
}
