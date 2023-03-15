import { Button, Modal } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { closeDialog } from "../../view/dialogs/dialog";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import "./index.css";

export interface InfoEditDialogParams {
  initText: string;
  callback: (str: string) => void;
}

export function InfoEditDialog(visible: boolean, params: InfoEditDialogParams) {
  const closePanel = useCallback(() => {
    closeDialog("infoEditDialog");
  }, []);

  if (!params) {
    return <></>;
  }

  const { initText, callback } = params;
  return (
    <Modal
      open={visible}
      maskClosable={true}
      onCancel={closePanel}
      footer={null}
      width={400}
      closable={false}
    >
      <InfoEdit
        text={initText}
        onSave={(text: string) => {
          callback(text);
          closePanel();
        }}
      ></InfoEdit>
    </Modal>
  );
}

export interface InfoEditParams {
  text: string;
  onSave: (text: string) => void;
}

export function InfoEdit(params: InfoEditParams) {
  const { Comp, setText, getText } = useMarkDownEdit();

  useEffect(() => {
    setText(params.text);
  }, [params.text]);

  return (
    <div className="infoEdit">
      <div className="editer">{Comp}</div>
      <div className="save">
        <Button
          onClick={() => {
            params.onSave(getText());
          }}
        >
          保存
        </Button>
      </div>
    </div>
  );
}

export function useMarkDownEdit() {
  const [value, setValue] = useState<string>("");

  function setText(str: string) {
    setValue(str);
  }

  function getText(): string {
    return value;
  }

  return {
    Comp: (
      <SimpleMDE
        value={value}
        onChange={(v: string) => {
          setValue(v);
        }}
      ></SimpleMDE>
    ),
    setText,
    getText,
  };
}
