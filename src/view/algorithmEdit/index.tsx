import "./index.css";
import { Header } from "../../components/header";
import { Button, Input, InputRef, Modal, Select } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCodeEditor } from "./Editor";
import { closeDialog, openDialog } from "../dialogs/dialog";
import { getLocationQuery, Subject } from "../../common/utils";
import { useLocation, useNavigate } from "react-router-dom";
import * as algorithmAPI from "../../net/algorithmAPI";
import { ApiDriver } from "../../openAPI/driver";

export type AlgorithmInfoKey = "id" | "name" | "account" | "snapshot";

export type AlgorithmInfo = {
  id: string;
  account: string;
  name: string;
  content: {
    showCode: string;
    runCode: string;
  };
  permission: number;
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
    };
  } else {
    const r = await algorithmAPI.getAlgorithmInfo(id);
    return {
      id: r.id,
      account: r.account,
      name: r.name,
      content: JSON.parse(r.content),
      permission: r.permission,
    };
  }
}

export function AlgorithmEdit() {
  const [showCodeEnable] = useState<boolean>(false);
  const { el: editor1, getCode: getCode1, setCode: setCode1 } = useCodeEditor();
  const { el: editor2, getCode: getCode2, setCode: setCode2 } = useCodeEditor();
  const [alInfo, setInfo] = useState<AlgorithmInfo | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const id = getLocationQuery("id", location.search);
  const nameRef = useRef<string>(alInfo?.name ?? "");

  const load = useCallback(() => {
    getAlInfo(id).then((info: AlgorithmInfo) => {
      setInfo(info);
      setCode1(info.content.showCode);
      setCode2(info.content.runCode);
    });
  }, [setInfo, setCode1, setCode2, id]);

  useEffect(load, [id, load]);

  async function save(): Promise<string | null> {
    if (nameRef.current === "") {
      openDialog("setAlgorithmName");
      return null;
    } else {
      const content = {
        showCode: getCode1(),
        runCode: getCode2(),
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
    let code = getCode2();
    if (code) {
      await ApiDriver.start(code);
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
            </div>
          ) : (
            <></>
          )
        }
      ></Header>
      <div className="algorithmEditContent">
        <div className="left">
          {!showCodeEnable && <div className="mask"></div>}
          {!showCodeEnable && (
            <div className="container">
              <Button>启用展示代码</Button>
            </div>
          )}
          {editor1}
        </div>
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
    }
  }, []);

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
