import { Button, Modal } from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { closeDialog } from "../../view/dialogs/dialog";
import SimpleMDE from "react-simplemde-editor";
import showdown from "showdown";
import "easymde/dist/easymde.min.css";
import "./index.css";

let converter = new showdown.Converter();

function customMarkdownParser(text: string): string {
  return converter.makeHtml(text);
}

export interface InfoEditDialogParams {
  initText: string;
  editable: boolean;
  callback: (str: string) => void;
}

export function InfoEditDialog(visible: boolean, params: InfoEditDialogParams) {
  const closePanel = useCallback(() => {
    closeDialog("infoEditDialog");
  }, []);

  if (!params) {
    return <></>;
  }

  const { initText, callback, editable } = params;
  return (
    <Modal
      open={visible}
      maskClosable={true}
      onCancel={closePanel}
      footer={null}
      width={500}
      closable={false}
    >
      <InfoEdit
        text={initText}
        editable={editable}
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
  editable: boolean;
  onSave: (text: string) => void;
}

export function InfoEdit(params: InfoEditParams) {
  const { text, editable, onSave } = params;
  const { Comp, setText, getText } = useMarkDownEdit(editable);
  const inited = useRef<boolean>(false);

  useEffect(() => {
    if (!inited.current) {
      setText(text);
      inited.current = true;
    }
  }, [text, setText]);

  return (
    <div className="infoEdit">
      <div className="editer">{Comp}</div>
      {editable && (
        <div className="save">
          <Button
            onClick={() => {
              onSave(getText());
            }}
          >
            保存
          </Button>
        </div>
      )}
    </div>
  );
}

export function useMarkDownEdit(editable: boolean) {
  const [value, setValue] = useState<string>("");

  const setText = useCallback(
    (str: string) => {
      setValue(str);
    },
    [setValue]
  );

  const getText = useCallback(() => {
    return value;
  }, [value]);

  const options = useMemo(() => {
    return {
      autofocus: true,
      spellChecker: false,
      maxHeight: "375px",
      previewRender(text) {
        return customMarkdownParser(text);
      },
    } as EasyMDE.Options;
  }, []);

  return {
    Comp: (
      <SimpleMDE
        value={value}
        options={options}
        onChange={(v: string) => {
          setValue(v);
        }}
        getMdeInstance={(mde: any) => {
          if (!editable) {
            if (!mde.isPreviewActive()) {
              mde.toolbar_div.style.display = "block";
              mde.togglePreview();
              mde.toolbar_div.style.display = "none";
            }
          } else {
            mde.toolbar_div.style.display = "block";
          }
        }}
      ></SimpleMDE>
    ),
    setText,
    getText,
  };
}
