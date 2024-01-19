import {
  ArrayField,
  CheckboxGroupInput,
  Datagrid,
  DateField,
  EditButton,
  List,
  NumberField,
  ReferenceInput,
  TextField
} from "react-admin";
import ValidatedField from "./ValidatedField";

const filters = [
  <ReferenceInput
    key="type"
    source="type"
    reference="investmentTypes"
    label="Type"
    alwaysOn
  />,
  <CheckboxGroupInput
    key="to-validate"
    source="to-validate"
    label=""
    choices={
      [
        { id: "true", name: "À valider" },
      ] as any
    }
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
      <ValidatedField source="validatedAt" label="Validé" />
      <EditButton />
    </Datagrid>
  </List>
);

export default EntriesList;
