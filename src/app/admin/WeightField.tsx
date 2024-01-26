import styled from "@emotion/styled";
import { Button, ButtonGroup, TextField, TextFieldProps } from "@mui/material";
import { ChangeEvent, useState } from "react";

type WeightFieldProps = Omit<TextFieldProps, "onChange"> & {
  onChange: (value: number) => void;
};

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
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

const WeightField = ({ onChange, ...rest }: WeightFieldProps) => {
  const [selectedUnit, setSelectedUnit] = useState<WeightUnit>({
    value: 1000,
    label: "kg",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    onChange(value / selectedUnit.value);
  };

  const handleUnitChange = (unit: WeightUnit) => () => {
    setSelectedUnit(unit);
    onChange(parseFloat(rest.value as string) / selectedUnit.value);
  };

  return (
    <Container>
      <TextField {...rest} type="number" onChange={handleChange} />
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

export default WeightField;
