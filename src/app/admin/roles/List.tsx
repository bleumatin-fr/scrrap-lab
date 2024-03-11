import {
  Datagrid,
  DateField,
  EditButton,
  FunctionField,
  List,
  RaRecord,
  TextField,
} from "react-admin";

const MAX_ACTIONS_DISPLAYED = 18;

const UserList = () => (
  <List sort={{ field: "name", order: "ASC" }}>
    <Datagrid rowClick={false}>
      <TextField source="name" label="Nom" />
      <FunctionField
        label="Actions"
        render={(record: any) => {
          const displayed = record.actions
            .slice(0, MAX_ACTIONS_DISPLAYED)
            .join(", ");

          if (record.actions.length > MAX_ACTIONS_DISPLAYED) {
            const numberRemaining =
              record.actions.length - MAX_ACTIONS_DISPLAYED;
            return `${displayed}  + ${numberRemaining}`;
          }

          return displayed;
        }}
        sx={{ whiteSpace: "normal" }}
      />
      <EditButton />
    </Datagrid>
  </List>
);

export default UserList;
