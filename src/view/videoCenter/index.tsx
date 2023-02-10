import "./index.css";
import { Button, Input } from "antd";
import { Header } from "../../components/header";
import { TopMenu } from "../../components/topMenu";
export function VideoCenter() {
  return (
    <div className="videoCenter">
      <Header
        content={
          <div className="topMenu">
            <TopMenu></TopMenu>
          </div>
        }
      ></Header>
      <div className="videoCenterContent">
        <div className="left">
          <div className="search">
            <Input.Search></Input.Search>
          </div>
          <div className="all">
            <Button type="text">全部录像</Button>
          </div>
          <div className="mine">
            <Button type="text">我的录像</Button>
          </div>
          <div className="blank"></div>
        </div>
        <div className="right">
          <VideoList></VideoList>
        </div>
      </div>
    </div>
  );
}

function VideoList() {
  let videos = [
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
    <div className="videoList">
      {videos.map(() => {
        return <div className="video"></div>;
      })}
    </div>
  );
}
