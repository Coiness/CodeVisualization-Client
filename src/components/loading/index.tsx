import "./index.css";
import { Spin } from "antd";

export function Loading() {
  return (
    <div className="loading">
      <div className="loadingContent">
        <Spin tip="加载中" size="large">
          <div className="content" />
        </Spin>
      </div>
    </div>
  );
}
