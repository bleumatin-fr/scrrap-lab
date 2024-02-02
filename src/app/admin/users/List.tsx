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
      <TextField source="firstName" label="Prénom" />
      <TextField source="lastName" label="Nom de famille"/>
      <TextField source="company" label="Société"/>
      <EmailField source="email" label="Email"/>
      <ReferenceField source="role" reference="roles" label="Role">
        <TextField source="name" />
      </ReferenceField>
      <DateField source="createdAt" label="Date de création" />
      <DateField source="updatedAt" label="Date de modification" />
      <EditButton />
    </Datagrid>
  </List>
);

export default UserList;
