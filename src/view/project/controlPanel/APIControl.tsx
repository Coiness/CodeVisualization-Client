import { useCallback, useRef } from "react";
import { ApiDriver } from "../../../openAPI/driver";
export function ApiControl() {
  const text = useRef<HTMLTextAreaElement>(null);

  const handleClick = useCallback(() => {
    if (text.current) {
      const code = text.current.value;
      ApiDriver.start(code);
    }
  }, []);

  return (
    <div>
      <textarea
        ref={text}
        style={{ width: "300px", height: "300px" }}
      ></textarea>
      <br />
      <button onClick={handleClick}>API</button>
    </div>
  );
}
