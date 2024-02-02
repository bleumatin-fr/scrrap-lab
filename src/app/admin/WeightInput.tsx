import styled from "@emotion/styled";
import { Button, ButtonGroup, TextFieldProps } from "@mui/material";
import { useState } from "react";
import NumberInput from "./NumberInput";

type WeightInputProps = Omit<TextFieldProps, "onChange"> & {
  onChange: (value: number) => void;
};

const Container = styled.div`
  display: flex;
  align-items: center;
  min-width: 270px;
`;

interface WeightUnit {
  value: number;
  label: string;
}

const weightUnits: WeightUnit[] = [
  {
    value: 1,
    label: "g",
  },
  {
    value: 1000,
    label: "kg",
  },
];

const WeightInput = ({ onChange, ...rest }: WeightInputProps) => {
  const [value, setValue] = useState(rest.value as number);
  const [selectedUnit, setSelectedUnit] = useState<WeightUnit>({
    value: 1000,
    label: "kg",
  });

  const handleChange = (value: number) => {
    setValue(value);
    onChange(value);
  };

  const handleUnitChange = (unit: WeightUnit) => () => {
    setSelectedUnit(unit);
    onChange(parseFloat(rest.value as string) / selectedUnit.value);
  };

  return (
    <Container>
      <NumberInput {...rest} onChange={handleChange} value={value}/>
      <ButtonGroup
        variant="contained"
        aria-label="outlined primary button group"
        size="small"
      >
        {weightUnits.map((unit) => (
          <Button
            key={unit.label}
            variant={
              selectedUnit.label === unit.label ? "contained" : "outlined"
            }
            onClick={handleUnitChange(unit)}
          >
            {unit.label}
          </Button>
        ))}
      </ButtonGroup>
    </Container>
  );
};

export default WeightInput;
