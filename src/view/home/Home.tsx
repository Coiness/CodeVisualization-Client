import "./index.css";
import { Header } from "../../components/header";
import { TopMenu } from "../../components/topMenu";
import { Content } from "./Content";
export function Home() {
  // let location = useLocation();
  // useEffect(() => {
  //   console.log("DEBUG: ", location);
  // }, [location]);
  return (
    <div>
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
