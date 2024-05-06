import styled from "@emotion/styled";
import { RichTextInput } from "ra-input-rich-text";
import {
  AutocompleteInput,
  CheckboxGroupInput,
  Create,
  ImageField,
  ImageInput,
  RadioButtonGroupInput,
  ReferenceArrayInput,
  ReferenceInput,
  SimpleForm,
  TextInput,
  Validator,
  required,
} from "react-admin";
import { useWatch } from "react-hook-form";
import RemoveChoiceButton from "./RemoveChoiceButton";
import OffcutReferenceInput from "./OffcutReferenceInput";

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

const BrandPolicyContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

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

export const addBasePathToOffcutPictures = (data: any) => {
  return {
    ...data,
    pictures: data.pictures.map((picture: any) => {
      return {
        ...picture,
        src: `/scrrap-lab${picture.src}`,
      };
    }),
  };
};

const OffcutCreate = () => {
  return (
    <Create redirect="list" transform={addBasePathToOffcutPictures}>
      <SimpleForm>
        <Fields />
      </SimpleForm>
    </Create>
  );
};

export default OffcutCreate;
