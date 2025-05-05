import {
  Datagrid,
  DateField,
  EditButton,
  FunctionField,
  List,
  NumberField,
  RaRecord,
  ReferenceField,
  ReferenceInput,
  TextField,
} from "react-admin";

const filters = [
  <ReferenceInput
    key="mode"
    source="mode"
    reference="transportModes"
    label="Mode"
    alwaysOn
  />,
];

const TransportList = () => (
  <List filters={filters} sort={{ field: "createdAt", order: "DESC" }}>
    <Datagrid rowClick={false}>
      <DateField source="date" label="Date" />
      <ReferenceField source="mode" reference="transportModes" label="Mode" />
      <NumberField
        source="distance"
        label="Distance"
        options={{ style: "unit", unit: "kilometer" }}
        input
      />
      <NumberField
        source="weight"
        label="Poids"
        transform={(value: any) => value / 1000}
        options={{ style: "unit", unit: "kilogram" }}
      />
      <NumberField source="passengers" label="Nombre de passagers" />
      <ReferenceField
        source="reason"
        reference="transportReasons"
        label="Raison"
      />
      <TextField source="from.properties.name" label="Départ" />
      <TextField source="to.properties.name" label="Destination" />
      <EditButton />
    </Datagrid>
  </List>
);

export default TransportList;
