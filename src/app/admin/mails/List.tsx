import { RichTextInput } from "ra-input-rich-text";
import {
  Datagrid,
  EditButton,
  List,
  TextField
} from "react-admin";


const UserList = () => (
  <List sort={{ field: "key", order: "ASC" }}>
    <Datagrid rowClick="edit">
      <TextField source="key" label="Mail" />
      <TextField source="subject" label="Sujet" />
      <EditButton />
    </Datagrid>
  </List>
);

export default UserList;
