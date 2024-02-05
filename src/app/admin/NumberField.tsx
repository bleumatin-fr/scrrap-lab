import styled from "@emotion/styled";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { IconButton, TextField, TextFieldProps } from "@mui/material";

const NumberFieldContainer = styled.div`
  display: flex;
  align-items: center;
`;

type NumberFieldProps = Omit<TextFieldProps, "onChange"> & {
  onChange: (value: number) => void;
};

const NumberField = (props: NumberFieldProps) => {
  const { onChange, value, ...rest } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(parseFloat(event.target.value));
  };

  const handleMinusClicked = () => {
    onChange && onChange((value as number) - 1);
  };

  const handlePlusClicked = () => {
    onChange && onChange((value as number) + 1);
  };

  return (
    <>
      <IconButton size="small" color="primary" onClick={handleMinusClicked}>
        <RemoveIcon />
      </IconButton>
      <TextField
        variant="outlined"
        sx={{ width: 100 }}
        {...props}
        type="text"
        InputLabelProps={{ shrink: true }}
        onChange={handleChange}
        inputProps={{ style: { textAlign: "center" } }}
      />
      <IconButton size="small" color="primary" onClick={handlePlusClicked}>
        <AddIcon />
      </IconButton>
    </>
  );
};

export default NumberField;
