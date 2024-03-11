import styled from "@emotion/styled";
import { Button, ButtonGroup, TextFieldProps } from "@mui/material";
import { useState } from "react";
import NumberField from "../NumberField";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

type WeightFieldProps = Omit<TextFieldProps, "onChange"> & {
  onChange: (value: number) => void;
};

const Container = styled.div`
  display: flex;
  align-items: center;
  min-width: 290px;
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
  const [value, setValue] = useState((rest.value as number) / 1000);
  const [selectedUnit, setSelectedUnit] = useState<WeightUnit>({
    value: 1000,
    label: "kg",
  });

  const handleChange = (newValue: number) => {
    setValue(newValue);
    onChange(newValue * selectedUnit.value);
  };

  const handleUnitChange = (unit: WeightUnit) => () => {
    setSelectedUnit(unit);
    onChange(value * unit.value);
  };

  return (
    <Container>
      <NumberField {...rest} onChange={handleChange} value={value} showButtons />
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
            startIcon={
              selectedUnit.label === unit.label ? (
                <CheckCircleOutlineIcon />
              ) : null
            }
          >
            {unit.label}
          </Button>
        ))}
      </ButtonGroup>
    </Container>
  );
};

export default WeightField;
