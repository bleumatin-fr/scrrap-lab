import {
  Datagrid,
  DateField,
  List,
  NumberField,
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
    <Datagrid rowClick="edit">
      <DateField source="date" label="Date" />
      <ReferenceField source="mode" reference="transportModes" label="Mode" />
      <NumberField source="consumption" label="Consommation" />
      <NumberField source="distance" label="Distance" />
      <NumberField source="weight" label="Poids" />
      <NumberField source="passengers" label="Nombre de passagers" />
      <ReferenceField
        source="reason"
        reference="transportReasons"
        label="Raison"
      />
      <TextField source="from.properties.name" label="Départ" />
      <TextField source="to.properties.name" label="Destination" />
    </Datagrid>
  </List>
);

export default TransportList;
