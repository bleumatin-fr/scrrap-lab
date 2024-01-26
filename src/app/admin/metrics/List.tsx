import {
  Datagrid,
  DateField,
  DateInput,
  EditButton,
  List,
  ListGuesser,
  NumberField,
  ReferenceField,
  ReferenceInput,
  TextField,
} from "react-admin";

const startOfYear = new Date(new Date().getFullYear(), 0, 1);
const today = new Date();

const filters = [
  <DateInput key="start" source="start" label="De" alwaysOn />,
  <DateInput key="end" source="end" label="À" alwaysOn />,
];

const MetricsList = () => (
  <List
    filters={filters}
    sort={{ field: "id", order: "ASC" }}
    filterDefaultValues={{
      start: startOfYear,
      end: today,
    }}
    pagination={false}
    perPage={1000}
  >
    <Datagrid>
      <TextField source="category" />
      <TextField source="id" />
      <NumberField source="value" />
    </Datagrid>
  </List>
);

export default MetricsList;
