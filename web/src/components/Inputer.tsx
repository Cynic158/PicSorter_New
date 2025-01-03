import React, { useEffect, useState } from "react";
import "../styles/components/inputer.scss";

interface InputerProps {
  placeholder: string;
  value: string;
  setValue: (val: string) => void;
  width?: string;
}

const Inputer: React.FC<InputerProps> = ({
  placeholder,
  value,
  setValue,
  width = "120px",
}) => {
  const [inputval, setInputVal] = useState("");

  useEffect(() => {
    setInputVal(value);

    return () => {};
  }, [value]);

  return (
    /* From Uiverse.io by WhiteNervosa */
    <div className="inputer-container" style={{ width: width }}>
      <input
        spellCheck={false}
        autoComplete="off"
        placeholder={placeholder}
        value={inputval}
        onChange={(event) => {
          setInputVal(event.target.value);
          setValue(event.target.value);
        }}
        type="text"
        className="textInput"
      />
    </div>
  );
};

export default Inputer;
