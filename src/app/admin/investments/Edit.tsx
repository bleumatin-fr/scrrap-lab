import {
  DateInput,
  Edit,
  NumberInput,
  ReferenceInput,
  SimpleForm,
  TextInput,
} from "react-admin";

const TransportEdit = () => (
  <Edit redirect="list">
  <SimpleForm>
    <ReferenceInput
      source="type"
      reference="investmentTypes"
      label="Type d'investissement"
    />
    <TextInput source="name" label="Nom" />
    <ReferenceInput
      source="condition"
      reference="investmentConditions"
      label="Condition"
    />
    <NumberInput source="weight" label="Poids" />
    <NumberInput source="usagePeriod" label="Durée d'usage prévisionnelle"/>
    <DateInput source="usageStart" label="Date de début d'usage" />
    <NumberInput source="quantity" label="Quantité"/>
  </SimpleForm>
  </Edit>
);

export default TransportEdit;
