import { useEffect, useRef } from "react";
import {
  AutocompleteInput,
  Create,
  DateInput,
  NumberInput,
  ReferenceInput,
  SimpleForm,
  required,
  useGetOne,
  useInput,
} from "react-admin";
import { useWatch } from "react-hook-form";
import AddressAutoComplete from "./AddressAutocomplete";
import computeDistance from "./computeDistance";

export const Fields = () => {
  const { field } = useInput({
    source: "distance",
  });
  const from = useWatch<{ from: GeoJSON.Feature }>({ name: "from" });
  const to = useWatch<{ to: GeoJSON.Feature }>({ name: "to" });
  const reasonId = useWatch<{ reason: string }>({ name: "reason" });
  const { data: reason } = useGetOne("transportReasons", { id: reasonId });

  const distance = useWatch<{ distance: GeoJSON.Feature }>({
    name: "distance",
  });
  const distanceTouched = useRef(false);

  useEffect(() => {
    if (from && to && distance === null && !distanceTouched.current) {
      field.onChange(computeDistance(from, to));
    }
  }, [distance, field, from, to]);

  useEffect(() => {
    if (distance && !distanceTouched.current) {
      distanceTouched.current = true;
    }
  }, [distance, field]);

  useEffect(() => {
    distanceTouched.current = false;
  }, [from, to]);

  console.log(reason);

  return (
    <>
      <DateInput
        source="date"
        label="Date"
        defaultValue={new Date()}
        validate={required()}
      />
      <ReferenceInput source="reason" reference="transportReasons">
        <AutocompleteInput
          optionText="value"
          label="Raison"
          validate={required()}
          sx={{
            width: 250,
          }}
        />
      </ReferenceInput>
      <ReferenceInput source="mode" reference="transportModes">
        <AutocompleteInput
          optionText="value"
          validate={required()}
          label="Mode de transport"
          sx={{
            width: 250,
          }}
        />
      </ReferenceInput>
      <AddressAutoComplete source="from" label="Adresse de départ" />
      <AddressAutoComplete source="to" label="Adresse d'arrivée" />
      <NumberInput
        source="distance"
        className="number-input"
        validate={required()}
        InputProps={{
          endAdornment: "km",
        }}
      />
      {reason?.key === "collection" && (
        <NumberInput
          source="weight"
          label="Poids"
          validate={required()}
          format={(value) => (value ? value / 1000 : 0)}
          parse={(value) => (value ? value * 1000 : 0)}
          InputProps={{
            endAdornment: "kg",
          }}
        />
      )}
      {reason?.key !== "collection" && (
        <NumberInput
          source="passengers"
          label="Nombre de passagers"
          validate={required()}
          defaultValue={1}
        />
      )}
    </>
  );
};

const TransportCreate = () => (
  <Create redirect="list">
    <SimpleForm>
      <Fields />
    </SimpleForm>
  </Create>
);

export default TransportCreate;
