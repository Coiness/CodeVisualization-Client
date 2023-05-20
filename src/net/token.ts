import { nowAccount } from "../store";

const TokenKey = "DSV_TOKEN";
const AccountKey = "DSV_ACCOUNT";

export function getToken(): string | null {
  return window.localStorage.getItem(TokenKey);
}

export function setToken(token: string) {
  window.localStorage.setItem(TokenKey, token);
}

export function getAccount(): string | null {
  return window.localStorage.getItem(AccountKey);
}

export function setAccount(account: string) {
  window.localStorage.setItem(AccountKey, account);
  nowAccount.set(account);
}

export function clear() {
  window.localStorage.removeItem(AccountKey);
  window.localStorage.removeItem(TokenKey);
  nowAccount.set(null);
}

export function isLogin(): boolean {
  return getAccount() !== null && getToken() != null;
}
