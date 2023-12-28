import {
  Create,
  DateInput,
  NumberInput,
  ReferenceInput,
  SimpleForm,
  TextInput,
} from "react-admin";

const InvestmentCreate = () => (
  <Create redirect="list">
    <SimpleForm>
      <ReferenceInput
        source="type"
        reference="investmentTypes"
        label="Type d'investissement"
      />
      <TextInput source="name" label="Identifiant" />
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
  </Create>
);

export default InvestmentCreate;
