import {
  ArrayField,
  Datagrid,
  DateField,
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
          <NumberField source="quantity" label="Quantité" />
        </Datagrid>
      </ArrayField>
      {/* <ReferenceArrayField source="offcuts" reference="offcuts" label="Chutes">
        <Datagrid bulkActionButtons={false}>
          <TextField source="reference" label="Référence" />
          <TextField source="name" label="Nom" />
          <ReferenceField source="matter" reference="matters" label="Matière" />
          <ReferenceField
            source="material"
            reference="materials"
            label="Matériaux"
          />
          <NumberField source="quantity" label="Quantité" />
        </Datagrid>
      </ReferenceArrayField> */}
      <ArrayField source="transports" label="Transports">
        <Datagrid bulkActionButtons={false}>
          <DateField source="date" label="Date" />
          <TextField source="mode.value" label="Mode" />
          <TextField source="reason.value" label="Raison" />
          <TextField source="from.properties.name" label="Départ" />
          <TextField source="to.properties.name" label="Destination" />
        </Datagrid>
      </ArrayField>
    </Datagrid>
  </List>
);

export default EntriesList;
