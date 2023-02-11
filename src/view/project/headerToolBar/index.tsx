import { ProjectInfo, ProjectInfoKey } from "../types";
import { Button, Input, InputRef, Modal } from "antd";
import { closeDialog, openDialog } from "../../dialogs/dialog";
import { useCallback, useEffect, useRef } from "react";
import { Subject } from "../../../common/utils";
import * as projectAPI from "../../../net/projectAPI";

export function HeaderToolBar(props: {
  info: ProjectInfo;
  change: (key: ProjectInfoKey, value: any) => void;
}) {
  const id = props.info.id;
  const nameRef = useRef<string>(props.info.name);

  async function save() {
    if (nameRef.current === "") {
      openDialog("setProjectName");
    } else {
      return projectAPI.createProject(
        nameRef.current,
        JSON.stringify(props.info.snapshot)
      );
    }
  }

  useEffect(() => {
    let sub = setProjectName.subscribe(async (name) => {
      nameRef.current = name;
      let id = await save();
      props.change("id", id);
    });
    return sub.unsubscribe;
  });

  return (
    <div>
      {id === "" ? (
        <div className="save">
          <Button type="default" onClick={save}>
            保存
          </Button>
        </div>
      ) : (
        <div className="projectName">{nameRef.current}</div>
      )}
    </div>
  );
}

export const setProjectName = new Subject<string>();

export function SetProjectNameDialog(visible: boolean) {
  const inp = useRef<InputRef | null>(null);

  const closePanel = useCallback(() => {
    closeDialog("setProjectName");
  }, [closeDialog]);

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
