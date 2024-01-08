import { RichTextInput } from "ra-input-rich-text";
import {
  CheckboxGroupInput,
  DateInput,
  Create,
  SimpleForm,
  TextInput,
  useResourceDefinition,
  ReferenceInput,
  AutocompleteInput,
  NumberInput,
  ReferenceArrayInput,
  RadioButtonGroupInput,
  ImageInput,
  ImageField,
} from "react-admin";
import { useWatch } from "react-hook-form";

export const MaterialInput = ({ source }: { source: string }) => {
  const matter = useWatch<{ matter: string }>({ name: "matter" });
  return (
    <ReferenceInput
      source={source}
      reference="materials"
      filter={{ parent: matter || "none" }}
      label="Matériaux"
    >
      <AutocompleteInput optionText="value" label="Matériaux" />
    </ReferenceInput>
  );
};

const OffcutCreate = () => {
  return (
    <Create redirect="list">
      <SimpleForm>
        <TextInput source="name" label="Nom" />
        <TextInput source="reference" label="Référence" />
        <RichTextInput
          source="description"
          label="Cartel"
          sx={{
            "& .ProseMirror": {
              minHeight: 150,
            },
          }}
        />
        <RichTextInput
          source="source"
          label="Provenance"
          sx={{
            "& .ProseMirror": {
              minHeight: 80,
            },
          }}
        />
        <ReferenceInput source="matter" reference="matters">
          <AutocompleteInput optionText="value" label="Matière" />
        </ReferenceInput>
        <MaterialInput source="material" />
        <ReferenceArrayInput source="sizes" reference="sizes">
          <CheckboxGroupInput optionText="value" label="Taille" />
        </ReferenceArrayInput>
        <ReferenceArrayInput source="colors" reference="colors">
          <CheckboxGroupInput optionText="value" label="Couleur" />
        </ReferenceArrayInput>
        <ReferenceInput source="quality" reference="qualities">
          <RadioButtonGroupInput optionText="value" label="Qualité" />
        </ReferenceInput>
        <ReferenceInput source="audience" reference="audiences">
          <RadioButtonGroupInput optionText="value" label="Destinataires" />
        </ReferenceInput>
        <ReferenceInput source="brandPolicy" reference="brandPolicies">
          <RadioButtonGroupInput
            optionText="value"
            label="Utilisation marque"
          />
        </ReferenceInput>
        <ImageInput source="pictures" multiple accept="image/*">
          <ImageField source="src" title="title" />
        </ImageInput>
      </SimpleForm>
    </Create>
  );
};

export default OffcutCreate;
