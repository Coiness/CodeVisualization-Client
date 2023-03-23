import { Button } from "antd";
import { useEffect, useState } from "react";
import { player } from ".";
import { useCodeEditor } from "../algorithmEdit/Editor";
import { ShowCodeInfo, ShowCodeItem } from "../algorithmEdit/ShowCode";
import "./showcode.css";

export interface ShowCodeViewProps {
  info: ShowCodeInfo;
}

export function ShowCodeView(props: ShowCodeViewProps) {
  const info = props.info;
  const [nowItem, setItem] = useState<ShowCodeItem>(props.info.list[0]);
  const { setCode, el, setHeightLine } = useCodeEditor(
    "show",
    nowItem?.lang ?? undefined
  );

  useEffect(() => {
    setItem(props.info.list[0]);
  }, [props.info]);

  useEffect(() => {
    if (nowItem !== null) {
      setCode(nowItem.code);
      setHeightLine(player.getHeightLine(nowItem.lang));
    }
  }, [nowItem, setCode, setHeightLine]);

  useEffect(() => {
    let sub = player.progress.subscribe(() => {
      setHeightLine(player.getHeightLine(nowItem.lang));
    });
    return sub.unsubscribe;
  }, [setHeightLine, nowItem]);

  return (
    <div className="showCodeManager">
      <div className="tab">
        <div className="tabContent">
          <div className="scroll">
            {info.list.map((item) => {
              return (
                <Button
                  className="tabItem"
                  key={item.lang}
                  onClick={() => {
                    setItem(item);
                  }}
                >
                  {item.lang}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="codeEditor">{el}</div>
    </div>
  );
}
