import "./index.css";
import { Button, Input } from "antd";
import { useEffect, useRef, useState } from "react";
import { CloseCircleOutlined } from "@ant-design/icons";

export interface InputContent {
  key: string;
  value: string;
}

interface InputContentAndId {
  id: number;
  key: string;
  value: string;
}

export function useInputList(editable: boolean) {
  const nowId = useRef<number>(0);
  const [data, setInputData] = useState<InputContentAndId[]>([]);

  function handleAdd() {
    setData([...data, { id: nowId.current++, key: "", value: "" }]);
  }

  function getData() {
    return data.map((item) => {
      return {
        key: item.key,
        value: item.value,
      };
    });
  }

  function setData(data: InputContent[]) {
    setInputData(
      data.map((item) => {
        return {
          ...item,
          id: nowId.current++,
        };
      })
    );
  }

  useEffect(() => {
    if (data.length === 0) {
      handleAdd();
    }
  });

  return {
    el: (
      <div className="inputList">
        <div className="inputListContent">
          <div className="lists">
            {data.map((item) => {
              return (
                <div className="inputContent" key={item.id}>
                  <div className="key">
                    <Input
                      placeholder="字段名"
                      defaultValue={item.key}
                      onChange={(e) => {
                        item.key = e.currentTarget.value;
                        setInputData([...data]);
                      }}
                      disabled={!editable}
                    ></Input>
                  </div>
                  <div className="value">
                    <Input
                      placeholder="字段值"
                      defaultValue={item.value}
                      onChange={(e) => {
                        item.value = e.currentTarget.value;
                        setInputData([...data]);
                      }}
                    ></Input>
                  </div>
                  {editable && (
                    <div className="remove">
                      {
                        <Button
                          shape="circle"
                          size="small"
                          type="text"
                          icon={<CloseCircleOutlined />}
                          onClick={() => {
                            let arr = [];
                            for (let i = 0; i < data.length; i++) {
                              if (data[i].id !== item.id) {
                                arr.push(data[i]);
                              }
                            }
                            setInputData(arr);
                          }}
                        ></Button>
                      }
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {editable && (
          <div className="bottom">
            <Button onClick={handleAdd}>添加字段</Button>
          </div>
        )}
      </div>
    ),
    getData,
    setData,
  };
}
