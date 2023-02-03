import { useNavigate } from "react-router-dom";

export function Logo() {
  let nav = useNavigate();
  return (
    <div
      onClick={() => {
        nav("/");
      }}
    >
      Logo
    </div>
  );
}
