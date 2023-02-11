import "./index.css";
import { Header } from "../../components/header";
import { TopMenu } from "../../components/topMenu";
import { Content } from "./Content";
export function Home() {
  return (
    <div className="home">
      <Header
        content={
          <div className="topMenu">
            <TopMenu></TopMenu>
          </div>
        }
      ></Header>
      <Content></Content>
    </div>
  );
}
