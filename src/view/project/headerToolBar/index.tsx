import "./index.css";
import { ProjectInfo, ProjectInfoKey } from "../types";
import { Button, Input, InputRef, message, Modal, Select } from "antd";
import { closeDialog, openDialog } from "../../dialogs/dialog";
import { useCallback, useEffect, useRef, useState } from "react";
import { Subject } from "../../../common/utils";
import * as projectAPI from "../../../net/projectAPI";
import {
  CloudDownloadOutlined,
  RedoOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { commitRedo, commitUndo, Recorder } from "../../../core";
import { initVideoInfo } from "../../../store";
import { useNavigate } from "react-router-dom";
import { InfoEditDialogParams } from "../../../components/infoEdit";
import { InputEdit } from "../../../components/inputEdit";

const recorder = new Recorder();

export function HeaderToolBar(props: {
  info: ProjectInfo;
  change: (key: ProjectInfoKey, value: any) => void;
  editable: boolean;
}) {
  const info = props.info;
  const nameRef = useRef<string>(info.name);
  const [recording, setRecording] = useState<boolean>(false);
  const navigate = useNavigate();
  const [editable, setEditable] = useState<boolean>(props.editable);

  useEffect(() => {
    setEditable(props.editable);
  }, [props.editable]);

  async function save() {
    const name = nameRef.current.trim();
    if (!name) {
      openDialog("setProjectName");
    } else {
      if (info.id) {
        let res = await projectAPI.saveProject(
          info.id,
          JSON.stringify(info.snapshot)
        );
        if (res) {
          message.success("保存成功");
        } else {
          message.error("保存失败");
        }
      } else {
        return projectAPI.createProject(
          name,
          JSON.stringify(info.snapshot),
          ""
        );
      }
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
      {nameRef.current !== "" && (
        <div className="projectName">
          <InputEdit
            value={nameRef.current}
            enable={editable}
            onChange={async (v: string) => {
              v = v.trim();
              if (v === "") {
                message.error("名称不能为空");
                return false;
              }
              let res = await projectAPI.renameProject(info.id, v);
              if (res) {
                nameRef.current = v;
              } else {
                message.error("修改失败");
              }
              return res;
            }}
          ></InputEdit>
        </div>
      )}
      {editable && (
        <Button type="default" onClick={save}>
          保存
        </Button>
      )}
      <Button icon={<CloudDownloadOutlined />}>下载到本地</Button>
      {editable && info.name !== "" && (
        <Select
          value={info.permission}
          onChange={handleSelectChange}
          options={[
            { value: 0, label: "仅自己可见" },
            { value: 1, label: "所有人可见" },
          ]}
        />
      )}
      {info.id && (editable || info.descrition) && (
        <Button
          onClick={() => {
            openDialog("infoEditDialog", {
              initText: info.descrition,
              editable: editable,
              callback: async (str: string) => {
                let flag = await projectAPI.updateProjectDescrition(
                  info.id,
                  str
                );
                if (flag) {
                  props.change("descrition", str);
                  message.success("修改成功");
                } else {
                  message.error("修改失败");
                }
              },
            } as InfoEditDialogParams);
          }}
        >
          {editable ? "编辑" : "查看"}演示说明
        </Button>
      )}
      <div className="blank"></div>
      {editable && (
        <Button
          icon={<UndoOutlined />}
          onClick={() => {
            commitUndo();
          }}
        >
          撤销
        </Button>
      )}
      {editable && (
        <Button
          icon={<RedoOutlined />}
          onClick={() => {
            commitRedo();
          }}
        >
          重做
        </Button>
      )}
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
              descrition: info.descrition,
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
    const name = inp?.current?.input?.value.trim();
    if (!name) {
      message.error("名称不能为空");
      return;
    }
    setProjectName.next(name);
    closePanel();
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
        <Input style={{ width: "75%" }} placeholder="请输入项目名" ref={inp} />
        <Button type="default" style={{ width: "25%" }} onClick={submit}>
          确定
        </Button>
      </Input.Group>
    </Modal>
  );
}
