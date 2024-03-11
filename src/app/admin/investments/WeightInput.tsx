import styled from "@emotion/styled";
import { Button, ButtonGroup } from "@mui/material";
import { useState } from "react";
import {
  NumberInput,
  NumberInputProps,
  TextInput,
  useInput,
} from "react-admin";
import NumberField from "../NumberField";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

type WeightInputProps = NumberInputProps & {};

const Container = styled.div`
  display: flex;
  align-items: center;
  min-width: 290px;
  gap: 8px;
  margin-bottom: 24px;

  > div:first-of-type {
    order: 0;
  }
  > div:nth-of-type(2) {
    order: 1;
  }
  > button:first-of-type {
    order: 2;
  }
  > button:nth-of-type(2) {
    order: 3;
  }
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

const WeightInput = ({ source, ...rest }: WeightInputProps) => {
  const { field, fieldState } = useInput({
    source,
    validate: (value: number) => {
      if (value < 0) {
        return "La quantité ne peut pas être négative";
      }
    },
  });

  const [value, setValue] = useState((field.value as number) / 1000);
  const [selectedUnit, setSelectedUnit] = useState<WeightUnit>({
    value: 1000,
    label: "kg",
  });

  const handleChange = (value: number) => {
    setValue(value);
    field.onChange(value * selectedUnit.value);
  };

  const handleUnitChange = (unit: WeightUnit) => () => {
    setSelectedUnit(unit);
    field.onChange(value * unit.value);
  };

  return (
    <Container>
      <NumberField
        {...rest}
        variant="filled"
        onChange={handleChange}
        value={value}
        showButtons
      />
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

export default WeightInput;
