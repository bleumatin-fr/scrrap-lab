import { Datagrid, DateField, List, TextField } from "react-admin";

const ListList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="key" />
      <TextField source="value" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </Datagrid>
  </List>
);

export default ListList;