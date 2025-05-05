import {
  Create,
  DateInput,
  NumberInput,
  ReferenceInput,
  SimpleForm,
  TextInput,
} from "react-admin";
import WeightInput from "./WeightInput";

const InvestmentCreate = () => (
  <Create redirect="list">
    <SimpleForm>
      <ReferenceInput
        source="type"
        reference="investmentTypes"
        label="Type d'investissement"
        required
      />
      <TextInput source="reference" label="Numéro d'inventaire" required />
      <TextInput source="name" label="Nom" required />
      <ReferenceInput
        source="condition"
        reference="investmentConditions"
        label="Condition"
        required
      />
      <WeightInput source="weight" label="Poids transporté" required />
      <NumberInput
        source="usagePeriod"
        label="Durée d'usage prévisionnelle"
        sx={{
          width: 350,
        }}
        InputProps={{
          endAdornment: "année(s)",
        }}
        required
      />
      <DateInput source="usageStart" label="Date de début d'usage" required />
      <NumberInput source="quantity" label="Quantité" required />
    </SimpleForm>
  </Create>
);

export default InvestmentCreate;
