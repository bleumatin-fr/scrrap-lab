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
      <DateInput
        source="usageStart"
        label="Date de début d'usage"
        required
        helperText="Dans le cas d'un bien acheté neuf, renseigner la date d'achat / Dans le cas d'un bien d'occasion, renseigner la date estimée de début d'usage de ce bien pour en connaître la durée de vie passée"
      />
      <NumberInput
        source="usagePeriod"
        label="Durée d'usage prévisionnelle"
        required
        helperText="Estimer la durée d'usage du bien pour en connaître la durée de vie restante estimée"
      />
      <NumberInput source="quantity" label="Quantité" required />
    </SimpleForm>
  </Edit>
);

export default TransportEdit;
