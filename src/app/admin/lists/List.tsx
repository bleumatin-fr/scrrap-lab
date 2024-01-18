import { Datagrid, DateField, EditButton, List, TextField } from "react-admin";

const ListList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="key" />
      <TextField source="value" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      <EditButton />
    </Datagrid>
  </List>
);

export default ListList;
