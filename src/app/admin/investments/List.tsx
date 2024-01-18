import {
  Datagrid,
  DateField,
  EditButton,
  List,
  NumberField,
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

const TransportList = () => (
  <List filters={filters} sort={{ field: "createdAt", order: "DESC" }}>
    <Datagrid rowClick="edit">
      <ReferenceField source="type" reference="investmentTypes" label="Type" />
      <TextField source="name" label="Nom" />
      <ReferenceField
        source="condition"
        reference="investmentConditions"
        label="Condition"
      />
      <NumberField source="weight" label="Poids" />
      <NumberField source="usagePeriod" label="Durée d'usage prévisionnelle" />
      <DateField source="usageStart" label="Date de début d'usage" />
      <NumberField source="quantity" label="Quantité" />
      <EditButton />
    </Datagrid>
  </List>
);

export default TransportList;
