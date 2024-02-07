import {
  ArrayField,
  CheckboxGroupInput,
  Datagrid,
  DateField,
  EditButton,
  List,
  NumberField,
  ReferenceField,
  ReferenceInput,
  TextField,
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
    choices={[{ id: "true", name: "À valider" }] as any}
    alwaysOn
  />,
];

const EntriesList = () => (
  <List filters={filters} sort={{ field: "date", order: "DESC" }}>
    <Datagrid rowClick="edit">
      <DateField source="date" label="Date" />
      <ReferenceField
        source="createdBy.id"
        reference="users"
        label="Utilisateur"
      />
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
      <ValidatedField source="validatedAt" label="Validé" />
      <EditButton />
    </Datagrid>
  </List>
);

export default EntriesList;
