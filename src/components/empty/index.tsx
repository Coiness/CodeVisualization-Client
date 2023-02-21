import "./index.css";
import { Empty as Em } from "antd";
export function Empty() {
  return (
    <div className="empty">
      <Em description={false} />
    </div>
  );
}
