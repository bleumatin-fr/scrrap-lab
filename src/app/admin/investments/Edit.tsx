import {
  DateInput,
  Edit,
  NumberInput,
  ReferenceInput,
  SimpleForm,
  TextInput,
} from "react-admin";
import WeightInput from "./WeightInput";

const TransportEdit = () => (
  <Edit redirect="list" title="Modifier Investissement">
    <SimpleForm>
      <ReferenceInput
        source="type"
        reference="investmentTypes"
        label="Type d'investissement"
        required
        inputProps={{
          autocomplete: "off",
        }}
      />
      <TextInput
        source="reference"
        label="Numéro d'inventaire"
        required
        inputProps={{
          autocomplete: "off",
        }}
      />
      <TextInput
        source="name"
        label="Nom"
        required
        inputProps={{
          autocomplete: "off",
        }}
      />
      <ReferenceInput
        source="condition"
        reference="investmentConditions"
        label="Condition"
        required
      />
      <WeightInput source="weight" label="Poids" required />
      <NumberInput
        source="usagePeriod"
        label="Durée d'usage prévisionnelle"
        required
      />
      <DateInput source="usageStart" label="Date de début d'usage" required />
      <NumberInput source="quantity" label="Quantité" required />
    </SimpleForm>
  </Edit>
);

export default TransportEdit;
