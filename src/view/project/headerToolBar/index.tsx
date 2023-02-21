import "./index.css";
import { ProjectInfo, ProjectInfoKey } from "../types";
import { Button, Input, InputRef, Modal, Select } from "antd";
import { closeDialog, openDialog } from "../../dialogs/dialog";
import { useCallback, useEffect, useRef, useState } from "react";
import { Subject } from "../../../common/utils";
import * as projectAPI from "../../../net/projectAPI";
import {
  CloudDownloadOutlined,
  RedoOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { execRedo, execUndo, Recorder } from "../../../core";
import { initVideoInfo } from "../../../store";
import { useNavigate } from "react-router-dom";

const recorder = new Recorder();

export function HeaderToolBar(props: {
  info: ProjectInfo;
  change: (key: ProjectInfoKey, value: any) => void;
}) {
  const info = props.info;
  const nameRef = useRef<string>(info.name);
  const [recording, setRecording] = useState<boolean>(false);
  const navigate = useNavigate();

  async function save() {
    if (nameRef.current === "") {
      openDialog("setProjectName");
    } else {
      return projectAPI.createProject(
        nameRef.current,
        JSON.stringify(info.snapshot)
      );
    }
  }

  useEffect(() => {
    let sub = setProjectName.subscribe(async (name) => {
      nameRef.current = name;
      let id = await save();
      props.change("id", id);
      navigate(`/project?id=${id}`);
    });
    return sub.unsubscribe;
  });

  function handleSelectChange(v: number) {
    if (info) {
      projectAPI.changeProjectPermission(info.id, v).then((flag) => {
        if (flag) {
          props.change("permission", v);
        }
      });
    }
  }

  return (
    <div className="projectHeader">
      <div className="projectName">{nameRef.current}</div>
      <Button type="default" onClick={save}>
        保存
      </Button>
      <Button icon={<CloudDownloadOutlined />}>下载到本地</Button>
      {info.name !== "" && (
        <Select
          value={info.permission}
          onChange={handleSelectChange}
          options={[
            { value: 0, label: "仅自己可见" },
            { value: 1, label: "所有人可见" },
          ]}
        />
      )}
      <div className="blank"></div>
      <Button
        icon={<UndoOutlined />}
        onClick={() => {
          execUndo();
        }}
      >
        撤销
      </Button>
      <Button
        icon={<RedoOutlined />}
        onClick={() => {
          execRedo();
        }}
      >
        重做
      </Button>
      {!recording && (
        <Button
          onClick={() => {
            setRecording(true);
            recorder.start();
          }}
        >
          录制
        </Button>
      )}
      {recording && (
        <Button
          onClick={() => {
            setRecording(false);
            const video = recorder.end();
            initVideoInfo.set({
              id: "",
              account: "",
              name: "",
              video,
              permission: 0,
            });
            navigate("/videoPlay");
          }}
        >
          停止
        </Button>
      )}
    </div>
  );
}

export const setProjectName = new Subject<string>();

export function SetProjectNameDialog(visible: boolean) {
  const inp = useRef<InputRef | null>(null);

  const closePanel = useCallback(() => {
    closeDialog("setProjectName");
  }, []);

  const submit = useCallback(() => {
    const name = inp?.current?.input?.value;
    if (name) {
      setProjectName.next(name);
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
        <Input style={{ width: "75%" }} placeholder="请输入项目名" ref={inp} />
        <Button type="default" style={{ width: "25%" }} onClick={submit}>
          确定
        </Button>
      </Input.Group>
    </Modal>
  );
}
