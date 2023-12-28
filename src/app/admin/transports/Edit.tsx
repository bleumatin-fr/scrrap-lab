import {
  DateInput,
  Edit,
  NumberInput,
  ReferenceInput,
  SimpleForm,
} from "react-admin";
import AddressAutoComplete from "./AddressAutocomplete";

const TransportEdit = () => (
  <Edit redirect="list">
    <SimpleForm>
      <DateInput source="date" label="Date" />
      <ReferenceInput
        source="mode"
        reference="transportModes"
        label="Mode de transport"
      />
      <NumberInput source="consumption" />
      <NumberInput source="distance" />
      <NumberInput source="weight" />
      <NumberInput source="passengers" />
      <ReferenceInput
        source="reason"
        reference="transportReasons"
        label="Raison"
      />
      <AddressAutoComplete source="from" label="Départ" />
      <AddressAutoComplete source="to" label="Destination" />
    </SimpleForm>
  </Edit>
);

export default TransportEdit;
