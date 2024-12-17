import styled from "@emotion/styled";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { IconButton, TextField, TextFieldProps } from "@mui/material";
import { useState } from "react";

const NumberFieldContainer = styled.div`
  display: flex;
  align-items: center;
`;

type NumberFieldProps = Omit<TextFieldProps, "onChange"> & {
  onChange: (value: number) => void;
  showButtons?: boolean;
};

const allowedKeyCodes = [
  48,
  49,
  50,
  51,
  52,
  53,
  54,
  55,
  56,
  57, // 0-9
  96,
  97,
  98,
  99,
  100,
  101,
  102,
  103,
  104,
  105, // numpad 0-9
  8,
  46, // backspace, delete
  37,
  39, // left, right
  188, // comma
  110,
  190, // dot
];

const NumberField = (props: NumberFieldProps) => {
  const { onChange, value, ...rest } = props;
  const [textValue, setTextValue] = useState(value?.toString() || "0");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(event.target.value);
    if (/^[-+]?[0-9]+(\.[0-9]+)?$/.test(event.target.value)) {
      const numberValue = parseFloat(event.target.value);
      onChange && onChange(numberValue);
    }
  };

  const handleBlur = () => {
    let numberValue = parseFloat(textValue.replace(",", "."));
    setTextValue(numberValue.toString());
    onChange && onChange(numberValue);
  };

  const handleMinusClicked = () => {
    let newValue = (value as number) - 1;
    if (newValue < 0) {
      newValue = 0;
    }
    setTextValue(newValue.toString());
    onChange && onChange(newValue);
  };

  const handlePlusClicked = () => {
    let newValue = (value as number) + 1;
    if (newValue < 0) {
      newValue = 0;
    }
    setTextValue(newValue.toString());
    onChange && onChange(newValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      !allowedKeyCodes.includes(event.keyCode) &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      event.preventDefault();
    }

    if (
      (event.keyCode === 190 || event.keyCode === 188) &&
      (textValue.includes(".") || textValue.includes(","))
    ) {
      event.preventDefault();
    }
  };

  return (
    <>
      {props.showButtons && (
        <IconButton size="small" color="primary" onClick={handleMinusClicked}>
          <RemoveIcon />
        </IconButton>
      )}
      <TextField
        variant="outlined"
        sx={{ width: 100, ...rest.sx }}
        type="text"
        InputLabelProps={{ shrink: true }}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        inputProps={{
          style: { textAlign: "center" },
          inputmode: "numeric",
          ...rest.inputProps,
        }}
        value={textValue}
        {...rest}
      />
      {props.showButtons && (
        <IconButton size="small" color="primary" onClick={handlePlusClicked}>
          <AddIcon />
        </IconButton>
      )}
    </>
  );
};

export default NumberField;
