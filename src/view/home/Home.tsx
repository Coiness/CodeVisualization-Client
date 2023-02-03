import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
export function Home() {
  let navigate = useNavigate();
  // let location = useLocation();
  // useEffect(() => {
  //   console.log("DEBUG: ", location);
  // }, [location]);
  return (
    <div>
      <div>Home</div>
      <div
        onClick={() => {
          navigate("/project");
        }}
      >
        to project
      </div>
    </div>
  );
}
