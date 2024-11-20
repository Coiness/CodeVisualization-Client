export enum ResultCode {
  Success = 2000, // 请求成功
  Reject = 5000, // 请求失败
  AccountError = 4001, // 账号异常
  TokenError = 4002, // token 过期
  ParamsError = 4003, // 请求参数有误
  NoPermission = 4004, // 没权限
  NoLogin = 4005, // 未登录
}

export interface Result {
  flag: boolean; // 标识请求是否成功
  code: ResultCode; // 请求结果的状态码
  message: string; // 请求结果的详细信息
  data: any; // todo any 治理，增加泛型控制请求返回值类型
}
