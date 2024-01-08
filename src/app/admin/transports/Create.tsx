import {
  Create,
  DateInput,
  NumberInput,
  ReferenceInput,
  SimpleForm,
  required,
} from "react-admin";
import AddressAutoComplete from "./AddressAutocomplete";

export const Fields = () => (
  <>
    <DateInput source="date" label="Date" defaultValue={new Date()}  validate={required()}/>
    <ReferenceInput
      source="mode"
      reference="transportModes"
      label="Mode de transport"
      validate={required()}
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
  </>
);

const TransportCreate = () => (
  <Create redirect="list">
    <SimpleForm>
      <Fields />
    </SimpleForm>
  </Create>
);

export default TransportCreate;
