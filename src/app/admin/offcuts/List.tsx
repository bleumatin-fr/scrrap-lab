import {
  AutocompleteInput,
  CheckboxGroupInput,
  Datagrid,
  DateField,
  DateInput,
  List,
  NumberField,
  RadioButtonGroupInput,
  ReferenceArrayField,
  ReferenceArrayInput,
  ReferenceField,
  ReferenceInput,
  TextField,
  TextInput,
} from "react-admin";
import { MaterialInput } from "./Create";

const filters = [
  <TextInput key="q" label="Recherche" source="q" alwaysOn />,
  <ReferenceInput
    key="matter"
    source="matter"
    reference="matters"
    label="Matière"
  >
    <AutocompleteInput optionText="value" label="Matière" />
  </ReferenceInput>,
  <MaterialInput key="material" source="material" />,
  <ReferenceArrayInput
    key="sizes"
    source="sizes"
    reference="sizes"
    label="Taille"
  >
    <CheckboxGroupInput optionText="value" label="Taille" />
  </ReferenceArrayInput>,
  <ReferenceArrayInput
    key="colors"
    source="colors"
    reference="colors"
    label="Couleur"
  >
    <CheckboxGroupInput optionText="value" label="Couleur" />
  </ReferenceArrayInput>,
  <ReferenceInput
    key="quality"
    source="quality"
    reference="qualities"
    label="Qualité"
  >
    <RadioButtonGroupInput optionText="value" label="Qualité" />
  </ReferenceInput>,
  <ReferenceInput
    key="audience"
    source="audience"
    reference="audiences"
    label="Destinataires"
  >
    <RadioButtonGroupInput optionText="value" label="Destinataires" />
  </ReferenceInput>,
  <DateInput key="date" source="createdBefore" label="Ajouté avant le" />,
  <DateInput key="date" source="createdAfter" label="Ajouté après le" />,
];

const OffcutList = () => (
  <List filters={filters} sort={{ field: "createdAt", order: "DESC" }}>
    <Datagrid rowClick="edit">
      <TextField source="reference" label="Référence" />
      <TextField source="name" label="Nom" />
      <ReferenceField source="matter" reference="matters" label="Matière" />
      <ReferenceField
        source="material"
        reference="materials"
        label="Matériaux"
      />
      <ReferenceArrayField source="colors" reference="colors" label="Couleur" />
      <ReferenceArrayField source="sizes" reference="sizes" label="Taille" />
      <ReferenceField source="quality" reference="qualities" label="Qualité" />
      <NumberField source="quantity" label="Quantité" />
      <DateField source="createdAt" label="Date d'ajout" />
    </Datagrid>
  </List>
);

export default OffcutList;
