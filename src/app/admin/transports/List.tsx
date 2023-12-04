import { Datagrid, DateField, List, NumberField, TextField } from "react-admin";
import TransportModeField from "./TransportModeField";
import TransportModeInput from "./TransportModeInput";

const filters = [
  <TransportModeInput key={"mode-filter"} label="Mode" source="mode" alwaysOn />,
];

const TransportList = () => (
  <List filters={filters}>
    <Datagrid rowClick="edit">
      <DateField source="createdAt" />
      <TransportModeField source="mode" />
      <NumberField source="distance" />
      <NumberField source="weight" />
      <NumberField source="passengers" />
    </Datagrid>
  </List>
);

export default TransportList;
