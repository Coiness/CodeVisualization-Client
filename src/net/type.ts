export enum ResultCode {
  Success = 2000, // 请求成功
  Reject = 5000, // 请求失败
  AccountError = 4001, // 账号异常
  TokenError = 4002, // token 过期
  ParamsError = 4003, // 请求参数有误
  NoPermission = 4004, // 没权限
}

export interface Result {
  flag: boolean;
  code: ResultCode;
  message: string;
  data: any;
}
