import { useNavigate } from "react-router-dom";
export function Content() {
  let navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate("/project");
      }}
    >
      to project
    </div>
  );
}
