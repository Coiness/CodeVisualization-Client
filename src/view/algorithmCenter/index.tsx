import "./index.css";
import { Button, Input } from "antd";
import { Header } from "../../components/header";
import { TopMenu } from "../../components/topMenu";
import { useEffect, useState } from "react";
import * as algorithmAPI from "../../net/algorithmAPI";
import { getDateString, getIntRandom, randomColor } from "../../common/utils";
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Loading } from "../../components/loading";

export type Algorithm = {
  id: string;
  name: string;
  user: {
    account: string;
    img: string;
    name: string;
  };
  createTime: number;
  modifyTime: number;
  bgi: string;
};

export function AlgorithmCenter() {
  const [algorithmList, setList] = useState<Algorithm[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (algorithmList === null) {
      algorithmAPI.searchAlgorithm("").then((res) => {
        if (algorithmList === null) {
          setList(
            res.algorithms.map((item: any) => {
              let deg = getIntRandom(0, 180);
              let c1 = randomColor(180, 220);
              let c2 = randomColor(180, 220);
              return {
                id: item.id,
                name: item.name,
                user: {
                  account: item.account,
                  img: item.user.img,
                  name: item.user.username,
                },
                createTime: parseInt(item.createTime),
                modifyTime: parseInt(item.modifyTime),
                bgi: `linear-gradient(${deg}deg, ${c1}, ${c2})`,
              };
            })
          );
        }
      });
    }
  }, []);

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
            <Button
              type="default"
              onClick={() => {
                navigate("/algorithmEdit");
              }}
            >
              新建算法
            </Button>
          </div>
        </div>
        <div className="right">
          <AlgorithmList list={algorithmList}></AlgorithmList>
        </div>
      </div>
    </div>
  );
}

function AlgorithmList(props: { list: Algorithm[] | null }) {
  let algorithms = props.list;
  const navigate = useNavigate();
  return algorithms ? (
    <div className="algorithmList">
      {algorithms.map((item) => {
        return (
          <div
            className="algorithm"
            key={item.id}
            style={{
              backgroundImage: item.bgi,
            }}
          >
            <div className="name">{item.name}</div>
            <div className="control">
              <div className="btns">
                <Button
                  shape="circle"
                  size="large"
                  icon={<EditOutlined />}
                  onClick={() => {
                    navigate(`/algorithmEdit?id=${item.id}`);
                  }}
                ></Button>
                <Button
                  shape="circle"
                  size="large"
                  icon={<DownloadOutlined />}
                ></Button>
                <Button
                  shape="circle"
                  size="large"
                  icon={<DeleteOutlined />}
                ></Button>
              </div>
            </div>
            <div className="user">
              <div
                className="img"
                style={{ backgroundImage: `url(${item.user.img})` }}
              ></div>
            </div>
            <div className="time">
              最近修改：{getDateString(item.modifyTime)}
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <Loading></Loading>
  );
}
