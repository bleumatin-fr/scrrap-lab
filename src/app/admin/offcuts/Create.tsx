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

export const MaterialInput = ({
  source,
  validate,
  label,
  alwaysOn,
}: {
  source: string;
  validate?: Validator | Validator[];
  label?: string;
  alwaysOn?: boolean;
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
        fullWidth
      />
    </ReferenceInput>
  );
};

export const Fields = () => {
  return (
    <>
      <TextInput source="name" label="Nom" validate={required()} />
      <TextInput source="reference" label="Référence" validate={required()} />
      <RichTextInput
        source="description"
        label="Cartel"
        sx={{
          "& .ProseMirror": {
            minHeight: 150,
          },
        }}
      />
      <TextInput source="source" label="Provenance"  validate={required()} />
      <ReferenceInput source="matter" reference="matters">
        <AutocompleteInput
          optionText="value"
          label="Matière"
          validate={required()}
        />
      </ReferenceInput>
      <MaterialInput source="material" validate={required()} />
      <ReferenceArrayInput source="sizes" reference="sizes">
        <CheckboxGroupInput optionText="value" label="Taille" />
      </ReferenceArrayInput>
      <ReferenceArrayInput source="colors" reference="colors">
        <CheckboxGroupInput optionText="value" label="Couleur" />
      </ReferenceArrayInput>
      <ReferenceInput source="quality" reference="qualities">
        <RadioButtonGroupInput optionText="value" label="Qualité" />
      </ReferenceInput>
      <ReferenceArrayInput source="audiences" reference="audiences">
        <CheckboxGroupInput
          optionText="value"
          label="Destinataires"
          validate={required()}
        />
      </ReferenceArrayInput>
      <ReferenceInput source="brandPolicy" reference="brandPolicies">
        <RadioButtonGroupInput optionText="value" label="Utilisation marque" />
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
