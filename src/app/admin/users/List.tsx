import {
  AutocompleteInput,
  Datagrid,
  DateField,
  EditButton,
  EmailField,
  List,
  ReferenceField,
  ReferenceInput,
  TextField,
} from "react-admin";

const filters = [
  <ReferenceInput
    key="role"
    source="role"
    reference="roles"
    label="Role"
    alwaysOn
  >
    <AutocompleteInput optionText="name" label="Role" />
  </ReferenceInput>,
];

const UserList = () => (
  <List filters={filters}>
    <Datagrid rowClick="edit">
      <TextField source="firstName" />
      <TextField source="lastName" />
      <TextField source="company" />
      <EmailField source="email" />
      <ReferenceField source="role" reference="roles">
        <TextField source="name" />
      </ReferenceField>
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      <EditButton />
    </Datagrid>
  </List>
);

export default UserList;
