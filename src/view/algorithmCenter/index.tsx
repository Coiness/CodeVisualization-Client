import "./index.css";
import { Button, Input } from "antd";
import { Header } from "../../components/header";
import { TopMenu } from "../../components/topMenu";
export function AlgorithmCenter() {
  return (
    <div className="algorithmCenter">
      <Header
        content={
          <div className="topMenu">
            <TopMenu></TopMenu>
          </div>
        }
      ></Header>
      <div className="algorithmCenterContent">
        <div className="left">
          <div className="search">
            <Input.Search></Input.Search>
          </div>
          <div className="all">
            <Button type="text">全部算法</Button>
          </div>
          <div className="mine">
            <Button type="text">我的算法</Button>
          </div>
          <div className="blank"></div>
          <div className="create">
            <Button type="default">新建算法</Button>
          </div>
        </div>
        <div className="right">
          <AlgorithmList></AlgorithmList>
        </div>
      </div>
    </div>
  );
}

function AlgorithmList() {
  let algorithms = [
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
  ];
  return (
    <div className="algorithmList">
      {algorithms.map(() => {
        return <div className="algorithm"></div>;
      })}
    </div>
  );
}
