import { Header } from "../../components/header";
import { TopMenu } from "../../components/topMenu";
export function VideoCenter() {
  return (
    <div>
      <Header
        content={
          <div className="topMenu">
            <TopMenu></TopMenu>
          </div>
        }
      ></Header>
      <div>Video Center</div>
    </div>
  );
}
