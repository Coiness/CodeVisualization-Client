import { PlusOutlined } from "@ant-design/icons";
import { Button, Popover } from "antd";
import { useCallback, useEffect, useState } from "react";
import { Loading } from "../../components/loading";
import { useCodeEditor } from "./Editor";
import "./showCode.css";
import { ShowCodeLanguage } from "./type";

export interface ShowCodeItem {
  lang: ShowCodeLanguage;
  code: string;
}

export interface ShowCodeInfo {
  list: ShowCodeItem[];
}

function findItemByLanguage(
  info: ShowCodeInfo,
  lang: ShowCodeLanguage
): ShowCodeItem | null {
  for (let i = 0; i < info.list.length; i++) {
    if (info.list[i].lang === lang) {
      return info.list[i];
    }
  }
  return null;
}

export interface ShowCodeProps {
  info: ShowCodeInfo | null;
}

const langsObj: Record<ShowCodeLanguage, 1> = {
  [ShowCodeLanguage.JS]: 1,
  [ShowCodeLanguage.JAVA]: 1,
  [ShowCodeLanguage.CPP]: 1,
};

const langs: ShowCodeLanguage[] = Object.keys(langsObj) as ShowCodeLanguage[];

export function useShowCode(props: ShowCodeProps) {
  const [info, setInfo] = useState<ShowCodeInfo | null>(null);
  const [nowItem, setItem] = useState<ShowCodeItem | null>(null);
  const { getCode, setCode, el } = useCodeEditor(
    "vs",
    nowItem?.lang ?? undefined
  );

  useEffect(() => {
    setInfo(props.info);
    setItem(props.info?.list[0] ?? null);
  }, [props.info]);

  useEffect(() => {
    if (nowItem !== null) {
      setCode(nowItem.code);
      return () => {
        nowItem.code = getCode();
      };
    }
  }, [nowItem, setCode, getCode]);

  const getInfo = useCallback(() => {
    if (nowItem !== null) {
      nowItem.code = getCode();
    }
    return info;
  }, [info, nowItem, getCode]);

  const addLang = useCallback(
    (lang: ShowCodeLanguage) => {
      if (!info) {
        return;
      }
      info.list.push({ lang: lang, code: "" });
      setInfo({ ...info });
    },
    [info, setInfo]
  );

  const isReady = !(info === null || nowItem === null);

  const [addPanelVisible, setAddPanelVisible] = useState<boolean>(false);

  return {
    el: (
      <div className="showCodeManager">
        <div className="tab">
          {!isReady && <Loading></Loading>}
          {isReady && (
            <>
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
              <Popover
                placement="bottom"
                visible={addPanelVisible}
                content={
                  <div className="addLangList">
                    <div className="scroll">
                      {langs
                        .filter((item) => {
                          let r = findItemByLanguage(info, item);
                          return r === null;
                        })
                        .map((item) => {
                          return (
                            <Button
                              type="text"
                              className="addLangListItem"
                              onClick={() => {
                                addLang(item);
                                setAddPanelVisible(false);
                              }}
                            >
                              {item}
                            </Button>
                          );
                        })}
                    </div>
                  </div>
                }
              >
                <Button
                  className="addLangEntry"
                  shape="circle"
                  disabled={info.list.length === langs.length}
                  icon={<PlusOutlined />}
                  type="text"
                  onClick={() => {
                    setAddPanelVisible(true);
                  }}
                ></Button>
              </Popover>
            </>
          )}
        </div>
        <div className="codeEditor">{el}</div>
      </div>
    ),
    getInfo,
  };
}
