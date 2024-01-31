import {
  AutocompleteInput,
  Edit,
  ReferenceInput,
  SimpleForm,
  TextInput
} from "react-admin";

const OffcutEdit = () => {
  return (
    <Edit redirect="list">
      <SimpleForm>
        <TextInput source="firstName" />
        <TextInput source="lastName" />
        <TextInput source="company" />
        <TextInput type="email" source="email" />
        <ReferenceInput source="role" reference="roles" label="Role">
          <AutocompleteInput optionText="name" label="Role" />
        </ReferenceInput>
      </SimpleForm>
    </Edit>
  );
};

export default OffcutEdit;
