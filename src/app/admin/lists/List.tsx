import { Datagrid, DateField, EditButton, List, TextField } from "react-admin";

const ListList = () => (
  <List
    sort={{
      field: "order",
      order: "ASC",
    }}
  >
    <Datagrid rowClick="edit">
      <TextField source="order" />
      <TextField source="value" />
      <TextField source="key" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      <EditButton />
    </Datagrid>
  </List>
);

export default ListList;
