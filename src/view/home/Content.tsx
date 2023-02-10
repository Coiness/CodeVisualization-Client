import "./content.css";
import { useNavigate } from "react-router-dom";
export function Content() {
  let navigate = useNavigate();
  return (
    <div className="content">
      <div
        className="newProject"
        onClick={() => {
          navigate("/project");
        }}
      >
        立即体验
      </div>
    </div>
  );
}
