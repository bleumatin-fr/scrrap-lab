import styled from "@emotion/styled";
import { TextField, Typography } from "@mui/material";
import { RichTextInput } from "ra-input-rich-text";
import { useCallback, useEffect, useState } from "react";
import {
  AutocompleteInput,
  CheckboxGroupInput,
  Create,
  ImageField,
  ImageInput,
  InputHelperText,
  RadioButtonGroupInput,
  ReferenceArrayInput,
  ReferenceInput,
  SimpleForm,
  TextInput,
  Validator,
  required,
  useGetList,
  useGetOne,
  useInput,
  useRecordContext
} from "react-admin";
import { useWatch } from "react-hook-form";
import RemoveChoiceButton from "./RemoveChoiceButton";

export const MaterialInput = ({
  source,
  validate,
  label,
  alwaysOn,
  fullWidth,
}: {
  source: string;
  validate?: Validator | Validator[];
  label?: string;
  alwaysOn?: boolean;
  fullWidth?: boolean;
}) => {
  const matter = useWatch<{ matter: string }>({ name: "matter" });
  return (
    <ReferenceInput
      source={source}
      reference="materials"
      filter={{ parent: matter || "none" }}
      label={label}
      alwaysOn={alwaysOn}
    >
      <AutocompleteInput
        optionText="value"
        label={label}
        validate={validate}
        fullWidth={fullWidth}
      />
    </ReferenceInput>
  );
};

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

const BrandPolicyContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const OffcutReferenceInput = ({ source: fieldSource }: { source: string }) => {
  const [source, materialId] = useWatch<{ source: string; material: string }>({
    name: ["source", "material"],
  });
  const { data: material } = useGetOne("materials", { id: materialId });
  const record = useRecordContext();
  const {
    field,
    fieldState: { isTouched, invalid, error },
    formState: { isSubmitted },
  } = useInput({
    source: fieldSource,
    defaultValue: record ? record[fieldSource] : "",
    validate: (value) => {
      if (sameNameOffcut && sameNameOffcut[0]) {
        return "Une chute avec cette référence existe déjà";
      }
    },
  });

  const referenceEnd = useCallback(() => {
    if (!source || !material) return "";
    return `-${material?.value
      .replaceAll(/\s/g, "")
      .substring(0, 3)
      .toUpperCase()}-${source
      .replaceAll(/\s/g, "")
      .substring(0, 3)
      .toUpperCase()}`;
  }, [source, material]);

  const { data: offcuts } = useGetList("offcuts", {
    pagination: {
      page: 1,
      perPage: 1,
    },
    sort: {
      field: "reference",
      order: "DESC",
    },
    filter: {
      referenceEnd: referenceEnd(),
    },
  });

  const { data: sameNameOffcut } = useGetList("offcuts", {
    pagination: {
      page: 1,
      perPage: 1,
    },
    sort: {
      field: "reference",
      order: "DESC",
    },
    filter: {
      reference: field.value,
    },
  });

  const nextReference = useCallback(() => {
    if (!offcuts || !offcuts[0]) return `001`;
    const nextNumber = parseInt(offcuts[0].reference.split("-")[0]) + 1;
    if (isNaN(nextNumber)) return `001`;
    return `${nextNumber.toString().padStart(3, "0")}`;
  }, [offcuts]);

  const [referenceDigits, setReferenceDigits] = useState(
    field.value.split("-")[2] || nextReference
  );

  useEffect(() => {
    setReferenceDigits(nextReference());
  }, [nextReference]);

  useEffect(() => {
    field.onChange(referenceDigits + referenceEnd());
  }, [referenceEnd, referenceDigits, field]);

  const handleOnBlur = () => {
    const value = parseInt(referenceDigits).toString().padStart(3, "0");
    setReferenceDigits(value);
  };

  return (
    <OffcutReferenceInputContainer>
      <TextField
        label="Référence"
        value={referenceDigits}
        inputProps={{
          style: { textAlign: "left", paddingRight: 0 },
        }}
        InputProps={{
          endAdornment: (
            <Typography variant="caption">{referenceEnd()}</Typography>
          ),
        }}
        onBlur={handleOnBlur}
        onChange={(event) => {
          const value = parseInt(event.target.value);
          if (value >= 0 && value <= 999) {
            setReferenceDigits(value.toString());
          }
        }}
        variant="filled"
        sx={{
          width: 120,
        }}
        error={(isTouched || isSubmitted) && invalid}
        helperText={
          (isTouched || isSubmitted) && invalid ? (
            <InputHelperText
              touched={isTouched || isSubmitted}
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

export const Fields = () => {
  return (
    <>
      <TextInput source="name" label="Nom" validate={required()} />
      <TextInput source="source" label="Provenance" validate={required()} />
      <ReferenceInput source="matter" reference="matters">
        <AutocompleteInput
          optionText="value"
          label="Matière"
          validate={required()}
        />
      </ReferenceInput>
      <MaterialInput source="material" label="Matériau" validate={required()} />
      <OffcutReferenceInput source="reference" />
      <RichTextInput
        source="description"
        label="Cartel"
        sx={{
          "& .ProseMirror": {
            minHeight: 150,
          },
        }}
      />
      <ReferenceArrayInput source="sizes" reference="sizes">
        <CheckboxGroupInput optionText="value" label="Taille" />
      </ReferenceArrayInput>
      <ReferenceArrayInput source="colors" reference="colors">
        <CheckboxGroupInput optionText="value" label="Couleur" />
      </ReferenceArrayInput>
      <ReferenceArrayInput source="qualities" reference="qualities">
        <CheckboxGroupInput optionText="value" label="Qualité" />
      </ReferenceArrayInput>
      <ReferenceArrayInput source="audiences" reference="audiences">
        <CheckboxGroupInput
          optionText="value"
          label="Destinataires"
          validate={required()}
        />
      </ReferenceArrayInput>
      <ReferenceInput source="brandPolicy" reference="brandPolicies">
        <BrandPolicyContainer>
          <RadioButtonGroupInput
            optionText="value"
            label="Exploitation de marque"
          />
          <RemoveChoiceButton source="brandPolicy" resetValue={null} />
        </BrandPolicyContainer>
      </ReferenceInput>
      <ImageInput source="pictures" multiple accept="image/*">
        <ImageField source="src" title="title" />
      </ImageInput>
    </>
  );
};

const OffcutCreate = () => {
  return (
    <Create redirect="list">
      <SimpleForm>
        <Fields />
      </SimpleForm>
    </Create>
  );
};

export default OffcutCreate;
