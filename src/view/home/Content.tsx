import { Button } from "antd";
import "./content.css";
import { useNavigate } from "react-router-dom";
import { PlayCircleOutlined } from "@ant-design/icons";

const listData = [
  [
    {
      title: "自定义算法",
      content:
        "通过调用开放 API 编写算法执行动画代码，执行后即可观看算法执行动画",
      bgc: "#fef9ed",
    },
    {
      title: "自定义输入",
      content: "执行算法动画代码时可输入不同数据生成对应数据的演示动画",
      bgc: "#f0feed",
    },
    {
      title: "动画与代码同步",
      content: "播放算法演示动画时可同步播放算法代码执行过程",
      bgc: "#feedee",
    },
  ],
  [
    {
      title: "动画控制",
      content: "可自由调节动画当前进度与动画播放速度",
      bgc: "#fcedfe",
    },
    {
      title: "自由演示",
      content: "可通过简单的拖拽点击等操作无需编写代码也能自由的演示算法",
      bgc: "#edfefd",
    },
    {
      title: "演示录制",
      content: "可对演示操作进行录制与重播",
      bgc: "#fafeed",
    },
  ],
];

export function Content() {
  let navigate = useNavigate();
  return (
    <div className="content">
      <div className="top">
        <div className="left">
          <div className="titles">
            <div className="name">D&A Visualization</div>
            <div className="info1">支持自定义算法的</div>
            <div className="info2">数据结构与算法可视化系统</div>
          </div>
          <div className="btns">
            <Button
              type="primary"
              onClick={() => {
                window.open(
                  "https://ypgkszgrlf.feishu.cn/docx/NkXEdYP3voczhixNDs9ce4qVnNe"
                );
              }}
            >
              快速入门
            </Button>
            <Button type="default" icon={<PlayCircleOutlined />}>
              视频介绍
            </Button>
          </div>
        </div>
        <div className="right">
          <div
            className="startNow"
            onClick={() => {
              navigate("/project");
            }}
          >
            立即体验
          </div>
        </div>
      </div>
      <div className="messageList">
        {listData.map((row) => {
          return (
            <div className="row">
              {row.map((item) => {
                return (
                  <div className="item" style={{ backgroundColor: item.bgc }}>
                    <div className="title">{item.title}</div>
                    <div className="content">{item.content}</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// D&A Visualization
// 支持自定义算法的                          立即体验
// 数据结构与算法可视化系统

// 快速入门 观看视频介绍

// 自定义算法：通过调用开放 API 编写算法执行动画代码，执行后即可观看算法执行动画
// 自定义输入：执行算法动画代码时可输入不同数据生成对应数据的演示动画
// 动画与代码同步：播放算法演示动画时可同步播放算法代码执行过程
// 动画控制：可自由调节动画当前进度与动画播放速度
// 自由演示：可通过简单的拖拽点击等操作无需编写代码也能自由的演示算法
// 演示录制：可对演示操作进行录制与重播
