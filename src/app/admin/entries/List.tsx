import {
  ArrayField,
  Datagrid,
  DateField,
  EditButton,
  List,
  NumberField,
  ReferenceArrayField,
  ReferenceField,
  ReferenceInput,
  TextField,
} from "react-admin";

const filters = [
  <ReferenceInput
    key="type"
    source="type"
    reference="investmentTypes"
    label="Type"
    alwaysOn
  />,
];

const EntriesList = () => (
  <List filters={filters} sort={{ field: "date", order: "DESC" }}>
    <Datagrid rowClick="edit">
      <DateField source="date" label="Date" />
      <ArrayField source="offcuts" label="Chutes">
        <Datagrid bulkActionButtons={false}>
          <TextField source="offcut.reference" label="Référence" />
          <TextField source="offcut.name" label="Nom" />
          <NumberField
            source="quantity"
            label="Poids"
            transform={(value) => value / 1000}
            options={{ style: "unit", unit: "kilogram" }}
          />
        </Datagrid>
      </ArrayField>
      <ArrayField source="transports" label="Transports">
        <Datagrid bulkActionButtons={false}>
          <DateField source="date" label="Date" />
          <TextField source="mode.value" label="Mode" />
          <TextField source="reason.value" label="Raison" />
          <TextField source="from.properties.name" label="Départ" />
          <TextField source="to.properties.name" label="Destination" />
          <EditButton />
        </Datagrid>
      </ArrayField>
    </Datagrid>
  </List>
);

export default EntriesList;
