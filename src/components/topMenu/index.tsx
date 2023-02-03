import { Menu } from "antd";
export function TopMenu() {
  let menuData = [
    { label: "演示中心", key: "project" },
    { label: "录像中心", key: "video" },
    { label: "算法中心", key: "algorithm" },
  ];
  return <Menu mode={"horizontal"} items={menuData}></Menu>;
}
