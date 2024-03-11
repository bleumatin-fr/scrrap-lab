import {
  AutocompleteInput,
  Edit,
  ReferenceInput,
  SimpleForm,
  TextInput,
} from "react-admin";

export const Fields = () => (
  <>
    <TextInput source="firstName" label="Prénom" />
    <TextInput source="lastName" label="Nom" />
    <TextInput source="meta" label="Société / Cursus" />
    <TextInput type="email" source="email" label="Addresse email" />
    <ReferenceInput source="role" reference="roles" label="Role">
      <AutocompleteInput optionText="name" label="Role" />
    </ReferenceInput>
  </>
);

const OffcutEdit = () => {
  return (
    <Edit redirect="list" title="Modifier Utilisateur">
      <SimpleForm>
        <Fields />
      </SimpleForm>
    </Edit>
  );
};

export default OffcutEdit;
