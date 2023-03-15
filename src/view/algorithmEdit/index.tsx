import "./index.css";
import { Header } from "../../components/header";
import { Button, Input, InputRef, message, Modal, Select } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCodeEditor } from "./Editor";
import { closeDialog, openDialog } from "../dialogs/dialog";
import { getLocationQuery, Subject } from "../../common/utils";
import { useLocation, useNavigate } from "react-router-dom";
import * as algorithmAPI from "../../net/algorithmAPI";
import { ApiDriver } from "../../openAPI/driver";
import {
  InputContent,
  inputListDialogSub,
  useInputList,
} from "../../components/inputList";
import { InfoEditDialogParams } from "../../components/infoEdit";
import { getAccount } from "../../net/token";

export type AlgorithmInfoKey = "id" | "name" | "account" | "snapshot";

export type AlgorithmInfo = {
  id: string;
  account: string;
  name: string;
  content: {
    showCode: string;
    runCode: string;
    inputList?: InputContent[];
  };
  permission: number;
  descrition: string;
};

async function getAlInfo(id: string | null) {
  if (id === null) {
    return {
      id: "",
      account: "",
      name: "",
      content: {
        showCode: "",
        runCode: "",
      },
      permission: 0,
      descrition: "",
    };
  } else {
    const r = await algorithmAPI.getAlgorithmInfo(id);
    return {
      id: r.id,
      account: r.account,
      name: r.name,
      content: JSON.parse(r.content),
      permission: r.permission,
      descrition: r.descrition,
    };
  }
}

export function AlgorithmEdit() {
  const [showCodeEnable, setShowCodeEnable] = useState<boolean>(false);
  const [inputEnable, setInputEnable] = useState<boolean>(false);
  const {
    el: editor1,
    getCode: getCode1,
    setCode: setCode1,
  } = useCodeEditor("vs");
  const {
    el: editor2,
    getCode: getCode2,
    setCode: setCode2,
  } = useCodeEditor("vs");
  const {
    el: InputList,
    getData: getInputListData,
    setData: setInputListData,
  } = useInputList(true);
  const [alInfo, setInfo] = useState<AlgorithmInfo | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const id = getLocationQuery("id", location.search);
  const nameRef = useRef<string>(alInfo?.name ?? "");
  const editable = !alInfo?.id || alInfo?.account === getAccount();

  const load = useCallback(() => {
    getAlInfo(id).then((info: AlgorithmInfo) => {
      setInfo(info);
      if (info.content.inputList) {
        setInputListData(info.content.inputList);
        setInputEnable(true);
      }
      if (info.content.showCode) {
        setCode1(info.content.showCode);
        setShowCodeEnable(true);
      }
      setCode2(info.content.runCode);
    });
  }, [
    id,
    setInfo,
    setCode1,
    setCode2,
    setInputEnable,
    setShowCodeEnable,
    setInputListData,
  ]);

  useEffect(load, [id, load]);

  async function save(): Promise<string | null> {
    if (alInfo?.id) {
      const content = {
        showCode: showCodeEnable ? getCode1() : null,
        runCode: getCode2(),
        inputList: inputEnable ? getInputListData() : undefined,
      };
      let flag = await algorithmAPI.saveAlgorithm(
        alInfo.id,
        JSON.stringify(content)
      );
      if (flag) {
        message.success("保存成功");
      } else {
        message.success("保存失败");
      }
      return alInfo.id;
    } else if (nameRef.current === "") {
      openDialog("setAlgorithmName");
      return null;
    } else {
      const content = {
        showCode: showCodeEnable ? getCode1() : null,
        runCode: getCode2(),
        inputList: inputEnable ? getInputListData() : undefined,
      };
      return await algorithmAPI.createAlgorithm(
        nameRef.current,
        JSON.stringify(content)
      );
    }
  }

  useEffect(() => {
    let sub = setAlgorithmName.subscribe(async (name) => {
      nameRef.current = name;
      let newId = await save();
      if (newId) {
        navigate(`/algorithmEdit?id=${newId}`);
      }
    });
    return sub.unsubscribe;
  });

  async function run() {
    let showCode = getCode1();
    let code = getCode2();
    if (inputEnable) {
      let data = getInputListData();
      openDialog("inputListDialog", data);
      data = await (async function () {
        return new Promise((resolve) => {
          let sub = inputListDialogSub.subscribe((d) => {
            resolve(d);
            sub.unsubscribe();
          });
        });
      })();

      if (code) {
        await ApiDriver.start(code, showCode, alInfo?.descrition ?? "", data);
        navigate("/videoPlay");
      }
    }
    if (code) {
      await ApiDriver.start(code, showCode, alInfo?.descrition ?? "");
      navigate("/videoPlay");
    }
  }

  function handleSelectChange(v: number) {
    if (alInfo) {
      algorithmAPI.changeAlgorithmPermission(alInfo.id, v).then((flag) => {
        if (flag) {
          setInfo({
            ...alInfo,
            permission: v,
          });
        }
      });
    }
  }

  return (
    <div className="algorithmEdit">
      <Header
        content={
          alInfo !== null ? (
            <div className="algorithmEditHeader">
              <div className="name">{alInfo.name}</div>
              <Button onClick={save}>保存</Button>
              <Button onClick={run}>执行</Button>
              {alInfo.name !== "" && (
                <Select
                  value={alInfo.permission}
                  onChange={handleSelectChange}
                  options={[
                    { value: 0, label: "仅自己可见" },
                    { value: 1, label: "所有人可用" },
                    { value: 2, label: "所有人可见" },
                  ]}
                />
              )}
              {alInfo.id && (
                <Button
                  onClick={() => {
                    openDialog("infoEditDialog", {
                      initText: alInfo.descrition,
                      editable: editable,
                      callback: async (str: string) => {
                        let flag = await algorithmAPI.updateAlgorithmDescrition(
                          alInfo.id,
                          str
                        );
                        if (flag) {
                          setInfo({
                            ...alInfo,
                            descrition: str,
                          });
                          message.success("修改成功");
                        } else {
                          message.error("修改失败");
                        }
                      },
                    } as InfoEditDialogParams);
                  }}
                >
                  {editable ? "编辑" : "查看"}算法说明
                </Button>
              )}
            </div>
          ) : (
            <></>
          )
        }
      ></Header>
      <div className="algorithmEditContent">
        <div className="left">
          <div className="top">
            {!showCodeEnable && <div className="mask"></div>}
            {!showCodeEnable && (
              <div className="container">
                <Button
                  onClick={() => {
                    setShowCodeEnable(true);
                  }}
                >
                  启用展示代码
                </Button>
              </div>
            )}
            {editor1}
          </div>
          <div className="line"></div>
          <div className="bottom">
            {!inputEnable && <div className="mask"></div>}
            {!inputEnable && (
              <div className="container">
                <Button
                  onClick={() => {
                    setInputEnable(true);
                  }}
                >
                  启用自定义输入
                </Button>
              </div>
            )}
            <div className="inputListContainer">{InputList}</div>
          </div>
        </div>
        <div className="middle"></div>
        <div className="right">{editor2}</div>
      </div>
    </div>
  );
}

const setAlgorithmName = new Subject<string>();

export function SetAlgorithmNameDialog(visible: boolean) {
  const inp = useRef<InputRef | null>(null);

  const closePanel = useCallback(() => {
    closeDialog("setAlgorithmName");
  }, []);

  const submit = useCallback(() => {
    const name = inp?.current?.input?.value;
    if (name) {
      setAlgorithmName.next(name);
      closePanel();
    }
  }, [closePanel]);

  return (
    <Modal
      open={visible}
      maskClosable={true}
      onCancel={closePanel}
      footer={null}
      width={400}
      closable={false}
    >
      <Input.Group compact>
        <Input style={{ width: "75%" }} placeholder="请输入算法名" ref={inp} />
        <Button type="default" style={{ width: "25%" }} onClick={submit}>
          确定
        </Button>
      </Input.Group>
    </Modal>
  );
}
