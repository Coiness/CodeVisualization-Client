import { useNavigate } from "react-router-dom";

export function Logo() {
  let nav = useNavigate();
  return (
    <div
      onClick={() => {
        nav("/");
      }}
      style={{ fontWeight: 700, fontSize: "30px" }}
    >
      DS Visualization
    </div>
  );
}
