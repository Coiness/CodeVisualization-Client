import { useEffect, useState } from "react";
import { player } from ".";
import "./console.css";

export function Console() {
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    player.progress.subscribe(() => {
      setList(player.getConsoles());
    });
  });

  return (
    <div className="console">
      <div className="title">输出</div>
      <div className="content">
        <div className="rows">
          {list.map((item, index) => {
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
