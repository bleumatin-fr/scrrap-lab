import styled from "@emotion/styled";
import { TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import {
    InputHelperText,
    useDataProvider, useInput,
    useRecordContext
} from "react-admin";
import { useWatch } from "react-hook-form";

const OffcutReferenceInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  width: 100%;

  .MuiFormHelperText-root {
    width: 100%;
    white-space: nowrap;
  }
`;

const OffcutReferenceInput = ({
  fieldSource,
  source,
  materialId,
}: {
  fieldSource: string;
  source: string;
  materialId: string;
}) => {
  const dataProvider = useDataProvider();

  const record = useRecordContext();

  const {
    field,
    fieldState: { isTouched, invalid, error },
    formState: { isSubmitted },
  } = useInput({
    source: fieldSource,
    defaultValue: record ? record[fieldSource] : "",
    validate: async (value: string) => {
      const sameNameOffcut = await dataProvider.getList("offcuts", {
        pagination: { page: 1, perPage: 1 },
        sort: { field: "reference", order: "DESC" },
        filter: {
            reference: value,
            notId: record?.id,
        },
      });

      if (sameNameOffcut && sameNameOffcut.data && sameNameOffcut.data.length) {
        return "Une chute avec cette référence existe déjà";
      }
    },
  });

  useEffect(() => {
    (async () => {
      if (!source || !materialId) {
        return;
      }
      const material = await dataProvider.getOne("materials", {
        id: materialId,
      });
      if (!material.data) {
        return;
      }
      const referenceEnd = `-${material.data.value
        .replaceAll(/\s/g, "")
        .substring(0, 3)
        .toUpperCase()}-${source
        .replaceAll(/\s/g, "")
        .substring(0, 3)
        .toUpperCase()}`;

      const currentNumber = field.value.includes("-")
        ? field.value.split("-")[0]
        : field.value.substring(0, 3);

      if (currentNumber.length) {
        field.onChange(`${currentNumber}${referenceEnd}`);
        return;
      }

      const offcuts = await dataProvider.getList("offcuts", {
        pagination: {
          page: 1,
          perPage: 1,
        },
        sort: {
          field: "reference",
          order: "DESC",
        },
        filter: {
          referenceEnd,
        },
      });

      if (!offcuts.data || !offcuts.data.length) {
        field.onChange(`001${referenceEnd}`);
        return;
      }

      const nextNumber = parseInt(offcuts.data[0].reference.split("-")[0]) + 1;
      if (isNaN(nextNumber)) {
        field.onChange(`001${referenceEnd}`);
        return;
      }
      field.onChange(
        `${nextNumber.toString().padStart(3, "0")}${referenceEnd}`
      );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, materialId]);

  const handleChange = async (event: any) => {
    const value = event.target.value;
    if (value.length > 3) {
      return;
    }
    const suffix = field.value.includes("-")
      ? field.value.substring(field.value.indexOf("-"))
      : field.value.substring(3);

      field.onChange(`${value.toString()}${suffix}`);
  };

  return (
    <OffcutReferenceInputContainer>
      <TextField
        label="Référence"
        value={
          field.value.includes("-")
            ? field.value.split("-")[0]
            : field.value.substring(0, 3)
        }
        inputProps={{
          style: { textAlign: "left", paddingRight: 0 },
        }}
        InputProps={{
          endAdornment: (
            <Typography variant="caption">
              {field.value?.includes("-")
                ? field.value.substring(field.value.indexOf("-"))
                : field.value.substring(3)}
            </Typography>
          ),
        }}
        onChange={handleChange}
        variant="filled"
        sx={{
          width: 120,
        }}
        error={(isTouched || isSubmitted) && invalid}
        helperText={
          (isTouched || isSubmitted) && invalid ? (
            <InputHelperText
              error={error?.message}
            />
          ) : (
            ""
          )
        }
      />
    </OffcutReferenceInputContainer>
  );
};

const OffcutReferenceInputWrapper = ({
  source: fieldSource,
}: {
  source: string;
}) => {
  const [source, materialId] = useWatch<{ source: string; material: string }>({
    name: ["source", "material"],
  });

  if (!source || !materialId) return null;

  return (
    <OffcutReferenceInput
      fieldSource={fieldSource}
      source={source}
      materialId={materialId}
    />
  );
};

export default OffcutReferenceInputWrapper;
