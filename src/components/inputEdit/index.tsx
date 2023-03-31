import { Input } from "antd";
import { useCallback, useEffect, useState } from "react";

export interface InputEditProps {
  value: string;
  onChange: (newNalue: string) => Promise<boolean>;
}

export function InputEdit(props: InputEditProps) {
  const [edit, setEdit] = useState<boolean>(false);

  const [value, setValue] = useState<string>(props.value);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const submit = useCallback(async () => {
    let res = await props.onChange(value);
    if (!res) {
      setValue(props.value);
    }
  }, [props.onChange, value, setValue]);

  return (
    <>
      {!edit && (
        <div
          className="view"
          onDoubleClick={() => {
            setEdit(true);
          }}
        >
          {value}
        </div>
      )}
      {edit && (
        <Input
          defaultValue={value}
          onBlur={() => {
            setEdit(false);
          }}
          onChange={(v) => {
            setValue(v.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              submit();
              setEdit(false);
            }
          }}
        ></Input>
      )}
    </>
  );
}
