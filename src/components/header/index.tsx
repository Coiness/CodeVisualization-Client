import "./index.css";
import { Logo } from "./Logo";
import { UserInfo } from "./userInfo";

export interface HeaderProps {
  content: JSX.Element;
}

export function Header(props: HeaderProps) {
  return (
    <div className="header">
      <Logo></Logo>
      <div className="content">{props.content}</div>
      <UserInfo></UserInfo>
    </div>
  );
}
