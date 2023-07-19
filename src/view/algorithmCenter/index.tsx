import "./index.css";
import { Button, Input, Popover, message } from "antd";
import { Header } from "../../components/header";
import { TopMenu } from "../../components/topMenu";
import { useCallback, useEffect, useState } from "react";
import * as algorithmAPI from "../../net/algorithmAPI";
import { downloadString, getDateString, getIntRandom, randomColor } from "../../common/utils";
import { DeleteOutlined, DownloadOutlined, EditOutlined, EyeOutlined, PlaySquareOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Loading } from "../../components/loading";
import { UserCard } from "../../components/userCard";
import { Empty } from "../../components/empty";
import { useAccount } from "../../components/header/userInfo";
import { DownAlgorithmInfo, getAlInfo } from "../algorithmEdit";
import { openDialog } from "../dialogs/dialog";
import { InputContent, inputListDialogSub } from "../../components/inputList";
import { execAlgorithm } from "../algorithmEdit/execAlgortithm";
import { FileEndNameMap, FileType } from "../../components/uploadFile";
import { isLogin } from "../../net/token";

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
  permission: number;
};

// todo any 治理 完善服务端返回值类型
export function constructAlgorithmList(algorithms: any[]): Algorithm[] {
  return algorithms.map((item: any) => {
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
      permission: item.permission,
    };
  });
}

export function AlgorithmCenter() {
  const [algorithmList, setList] = useState<Algorithm[] | null>(null);
  const navigate = useNavigate();

  async function getAlgorithmList(type: "all" | "search" | "mine", search?: string) {
    // todo any 治理 同上
    let list: any[] = [];
    if (type === "all") {
      let res = await algorithmAPI.searchAlgorithm("");
      list = res.algorithms;
    } else if (type === "search") {
      let res = await algorithmAPI.searchAlgorithm(search ?? "");
      list = res.algorithms;
    } else if (type === "mine") {
      if (!isLogin()) {
        message.info("请先登录");
        openDialog("login");
        return;
      }
      let res = await algorithmAPI.getMyAlgorithm();
      list = res.algorithms;
    }
    setList(constructAlgorithmList(list));
  }

  useEffect(() => {
    getAlgorithmList("all");
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
            <Input.Search
              onSearch={(s) => {
                getAlgorithmList("search", s);
              }}
            ></Input.Search>
          </div>
          <div className="all">
            <Button type="text" onClick={() => getAlgorithmList("all")}>
              全部算法
            </Button>
          </div>
          <div className="mine">
            <Button type="text" onClick={() => getAlgorithmList("mine")}>
              我的算法
            </Button>
          </div>
          <div className="blank"></div>
          <div className="upload">
            <Button
              type="default"
              onClick={() => {
                openDialog("uploadFileDialog", FileType.Algorithm);
              }}
            >
              上传算法
            </Button>
          </div>
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

export function AlgorithmList(props: { list: Algorithm[] | null }) {
  const [algorithms, setAlgorithms] = useState<Algorithm[] | null>(null);
  const navigate = useNavigate();
  const account = useAccount();
  useEffect(() => {
    setAlgorithms(props.list);
  }, [props.list]);

  const run = useCallback(
    async function (id: string) {
      let info = await getAlInfo(id);
      let showCode = info.content.showCode ?? null;
      let code = info.content.runCode;
      let inputList = info.content.inputList;
      let inputEnable = inputList !== null;
      let descrition = info.descrition;
      if (inputEnable) {
        openDialog("inputListDialog", {
          descrition: descrition ?? "",
          inputData: inputList,
        });
        let inputData: InputContent[] = await (async function () {
          return new Promise((resolve) => {
            let sub = inputListDialogSub.subscribe((d) => {
              resolve(d);
              sub.unsubscribe();
            });
          });
        })();

        if (code) {
          await execAlgorithm(code, showCode, descrition ?? "", navigate, inputData);
        }
      } else {
        if (code) {
          await execAlgorithm(code, showCode, descrition ?? "", navigate);
        }
      }
    },
    [navigate],
  );

  const downLoadAlgorithm = useCallback(async (id: string) => {
    let data = await getAlInfo(id);
    let info = {
      name: data.name,
      content: data.content,
      descrition: data.descrition,
    } as DownAlgorithmInfo;
    downloadString(`${data.name}.${FileEndNameMap[FileType.Algorithm]}`, JSON.stringify(info));
  }, []);

  return algorithms ? (
    algorithms.length > 0 ? (
      <div className="listContainer">
        <div className="algorithmList">
          {algorithms.map((item) => {
            const editable = item.user.account === account;
            const readable = editable || item.permission >= 2;
            const useble = readable || item.permission >= 1;
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
                    {readable && (
                      <Button
                        shape="circle"
                        size="large"
                        icon={editable ? <EditOutlined /> : <EyeOutlined />}
                        onClick={() => {
                          navigate(`/algorithmEdit?id=${item.id}`);
                        }}
                      ></Button>
                    )}
                    {useble && (
                      <Button
                        shape="circle"
                        size="large"
                        icon={<PlaySquareOutlined />}
                        onClick={() => {
                          run(item.id);
                        }}
                      ></Button>
                    )}
                    {readable && (
                      <Button
                        shape="circle"
                        size="large"
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          downLoadAlgorithm(item.id);
                        }}
                      ></Button>
                    )}
                    {editable && (
                      <Button
                        shape="circle"
                        size="large"
                        icon={<DeleteOutlined />}
                        onClick={async () => {
                          const confirm = await openDialog("confirmDialog", {
                            content: "确定要删除该算法吗",
                            okText: "确定",
                            cancelText: "取消",
                          });
                          if (!confirm) {
                            return;
                          }
                          let res = await algorithmAPI.removeAlgorithm(item.id);
                          if (res && algorithms) {
                            let newArr = [];
                            for (let i = 0; i < algorithms.length; i++) {
                              if (algorithms[i].id !== item.id) {
                                newArr.push(algorithms[i]);
                              }
                            }
                            setAlgorithms(newArr);
                          }
                        }}
                      ></Button>
                    )}
                  </div>
                </div>
                <div className="user">
                  <Popover
                    overlayInnerStyle={{ padding: "0px" }}
                    placement="right"
                    trigger={"click"}
                    zIndex={500}
                    content={<UserCard account={item.user.account} width="300px"></UserCard>}
                  >
                    <div className="img" style={{ backgroundImage: `url(${item.user.img})` }}></div>
                  </Popover>
                </div>
                <div className="time">最近修改：{getDateString(item.modifyTime)}</div>
              </div>
            );
          })}
        </div>
      </div>
    ) : (
      <div className="listContainer">
        <Empty></Empty>
      </div>
    )
  ) : (
    <Loading></Loading>
  );
}
