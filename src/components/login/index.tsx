import "./index.css";
import { useCallback, useEffect, useState } from "react";
import { Button, Input, Modal } from "antd";
import { Subject } from "../../common/utils";

export function openLogin() {
  loginVisible.next(true);
}

const loginVisible = new Subject<boolean>();

export function Login() {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const sub = loginVisible.subscribe((v) => {
      setVisible(v);
    });
    return sub.unsubscribe;
  }, []);

  const closePanel = useCallback(() => {
    loginVisible.next(false);
  }, []);

  return (
    <Modal
      open={visible}
      maskClosable={true}
      onCancel={closePanel}
      footer={null}
    >
      <LoginPanel></LoginPanel>
    </Modal>
  );
}

function LoginPanel() {
  const [model, setModel] = useState<"login" | "register">("login");
  return (
    <div className="loginPanel">
      {model === "login" && (
        <div className="login">
          <div className="title">登录</div>
          <div className="account">
            <div className="left">账号</div>
            <div className="right">
              <Input></Input>
            </div>
          </div>
          <div className="pwd">
            <div className="left">密码</div>
            <div className="right">
              <Input.Password></Input.Password>
            </div>
          </div>
          <div className="footer">
            <div className="right">
              <Button
                type="text"
                onClick={() => {
                  setModel("register");
                }}
              >
                新用户注册
              </Button>
            </div>
          </div>
        </div>
      )}
      {model === "register" && (
        <div className="register">
          <div className="title">注册</div>
          <div className="account">
            <div className="left">账号</div>
            <div className="right">
              <Input></Input>
            </div>
          </div>
          <div className="pwd">
            <div className="left">密码</div>
            <div className="right">
              <Input.Password></Input.Password>
            </div>
          </div>
          <div className="pwd2">
            <div className="left">确认密码</div>
            <div className="right">
              <Input.Password></Input.Password>
            </div>
          </div>
          <div className="username">
            <div className="left">用户名</div>
            <div className="right">
              <Input></Input>
            </div>
          </div>
          <div className="footer">
            <div className="right">
              <Button
                type="text"
                onClick={() => {
                  setModel("login");
                }}
              >
                已有账号，去登录
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
