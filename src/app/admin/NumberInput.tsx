import styled from "@emotion/styled";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { IconButton, TextField, TextFieldProps } from "@mui/material";

const NumberInputContainer = styled.div`
  display: flex;
  align-items: center;
`;

type NumberInputProps = Omit<TextFieldProps, "onChange"> & {
  onChange: (value: number) => void;
};

const NumberInput = (props: NumberInputProps) => {
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
    <NumberInputContainer>
      <IconButton size="small" color="primary" onClick={handleMinusClicked}>
        <RemoveIcon />
      </IconButton>
      <TextField
        {...props}
        type="text"
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        onChange={handleChange}
        sx={{ width: 100 }}
        inputProps={{ style: { textAlign: "center" } }}
      />
      <IconButton size="small" color="primary" onClick={handlePlusClicked}>
        <AddIcon />
      </IconButton>
    </NumberInputContainer>
  );
};

export default NumberInput;
