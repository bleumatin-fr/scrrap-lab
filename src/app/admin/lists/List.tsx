import { Datagrid, DateField, EditButton, List, TextField } from "react-admin";

const ListList = () => (
  <List
    sort={{
      field: "order",
      order: "ASC",
    }}
  >
    <Datagrid rowClick={false}>
      <TextField source="order" label="Ordre" />
      <TextField source="value" label="Valeur" />
      <TextField source="key" label="Clé" />
      <DateField source="createdAt" label="Date de création" />
      <DateField source="updatedAt" label="Date de modification" />
      <EditButton />
    </Datagrid>
  </List>
);

export default ListList;
