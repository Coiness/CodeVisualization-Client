import { Menu } from "antd";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

enum PageKey {
  Project = "project",
  Video = "video",
  Algorithm = "algorithm",
}

const PageMap = {
  [PageKey.Project]: "/projectCenter",
  [PageKey.Video]: "/videoCenter",
  [PageKey.Algorithm]: "/algorithmCenter",
};

export function TopMenu() {
  const navigate = useNavigate();
  let menuData: { label: string; key: PageKey }[] = [
    { label: "演示中心", key: PageKey.Project },
    { label: "录像中心", key: PageKey.Video },
    { label: "算法中心", key: PageKey.Algorithm },
  ];
  const handleClick = useCallback(
    (key: PageKey) => {
      navigate(PageMap[key]);
    },
    [navigate],
  );
  return <Menu mode={"horizontal"} items={menuData} onClick={(e) => handleClick(e.key as PageKey)}></Menu>;
}
