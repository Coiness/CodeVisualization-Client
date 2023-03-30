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

  const removeLang = useCallback(
    (lang: ShowCodeLanguage) => {
      if (!info) {
        return;
      }

      let arr: ShowCodeItem[] = [];
      info.list.forEach((item) => {
        if (item.lang !== lang) {
          arr.push(item);
        }
      });
      info.list = arr;
      setInfo({ ...info });

      if (nowItem?.lang === lang) {
        console.log("setItem", info.list[0]);
        setItem(info.list[0]);
      }
    },
    [info, setInfo, nowItem, setItem]
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
                      <div key={item.lang}>
                        <Button
                          type={nowItem.lang === item.lang ? "link" : "text"}
                          className="tabItem"
                          onClick={() => {
                            nowItem.code = getCode();
                            setItem(item);
                          }}
                        >
                          {item.lang}
                          {info.list.length > 1 && (
                            <span
                              className="tableItemRemove"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeLang(item.lang);
                              }}
                            >
                              ×
                            </span>
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
              <Popover
                placement="bottom"
                open={addPanelVisible}
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
                              key={item}
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
                    setAddPanelVisible(!addPanelVisible);
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
