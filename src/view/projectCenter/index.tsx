import { Header } from "../../components/header";
import { TopMenu } from "../../components/topMenu";
export function ProjectCenter() {
  return (
    <div>
      <Header
        content={
          <div className="topMenu">
            <TopMenu></TopMenu>
          </div>
        }
      ></Header>
      <div>Project Center</div>
    </div>
  );
}
