import "./console.css";
import { useRef, useState } from "react";
import { useReload } from "../../common/utils";

export function Console() {
  const list = useRef<string[]>(["111", "222"]);
  const reload = useReload();
  return (
    <div className="console">
      <div className="title">输出</div>
      <div className="content">
        <div className="rows">
          {list.current.map((item, index) => {
            return (
              <div className="row" key={index}>
                {item}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
