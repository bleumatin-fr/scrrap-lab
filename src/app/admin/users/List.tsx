import {
  AutocompleteInput,
  CreateButton,
  Datagrid,
  DateField,
  EditButton,
  EmailField,
  ExportButton,
  FilterButton,
  List,
  ReferenceField,
  ReferenceInput,
  SelectColumnsButton,
  TextField,
  TopToolbar,
} from "react-admin";
import UploadField from "./UploadField";

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

const Actions = () => (
    <TopToolbar>
        <CreateButton/>
        <ExportButton/>
        <UploadField/>
    </TopToolbar>
);

const UserList = () => (
  <List filters={filters} actions={<Actions/>}>
    <Datagrid rowClick={false}>
      <TextField source="firstName" label="Prénom" />
      <TextField source="lastName" label="Nom de famille"/>
      <TextField source="meta" label="Société / Cursus"/>
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
