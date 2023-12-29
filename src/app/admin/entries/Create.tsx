import {
  ArrayInput,
  Create,
  Datagrid,
  DateInput,
  NumberInput,
  ReferenceArrayInput,
  ReferenceInput,
  SimpleForm,
  SimpleFormIterator,
  TabbedForm,
  TextInput,
  useInput,
} from "react-admin";
import AddressAutoComplete from "../transports/AddressAutocomplete";

const AddTransportButton = ({ source }: { source: string }) => {
  const { field } = useInput({
    source,
  });

  const handleClick = () => {
    field.onChange([
      ...field.value,
      {
        date: new Date(),
        mode: null,
        consumption: null,
        distance: null,
        weight: null,
        passengers: null,
        reason: null,
        from: null,
        to: null,
      },
    ]);

    console.log(field.value);
  };
  return (
    <button type="button" onClick={handleClick}>
      Ajouter un transport
    </button>
  );
};

const EntryCreate = () => (
  <Create redirect="list">
    <TabbedForm>
      <TabbedForm.Tab label="Général">
        <DateInput label="Date" source="date" />
      </TabbedForm.Tab>
      <TabbedForm.Tab label="Transports">
        <AddTransportButton source="transports" />
        <ArrayInput source={"transports"}>
          <SimpleFormIterator inline>
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
          </SimpleFormIterator>
        </ArrayInput>
      </TabbedForm.Tab>
      <TabbedForm.Tab label="Chutes"></TabbedForm.Tab>
    </TabbedForm>
  </Create>
);

export default EntryCreate;
