import "./logo.css";
import { useNavigate } from "react-router-dom";

export function Logo() {
  let nav = useNavigate();
  return (
    <div
      className="logo"
      onClick={() => {
        nav("/");
      }}
    >
      D&A Visualization
    </div>
  );
}
