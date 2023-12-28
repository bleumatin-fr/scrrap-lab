import { AutocompleteInputChangeReason } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { get } from "lodash";
import { useEffect, useState } from "react";
import { useInput, useRecordContext } from "react-admin";
import { useDebounce } from "usehooks-ts";

export const geocode = async (q: string) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    q
  )}&addressdetails=1&namedetails=1&format=geojson`;

  const response = await fetch(url);
  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.statusText);
  }
  return await response.json();
};

interface AddressAutoCompleteProps {
  label: string;
  source: string;
}

const AddressAutoComplete = ({ label, source }: AddressAutoCompleteProps) => {
  const [options, setOptions] = useState<GeoJSON.Feature[]>([]);
  const record = useRecordContext();
  const [value, setValue] = useState<GeoJSON.Feature | null>(null);
  const [inputValue, setInputValue] = useState("");
  const { field } = useInput({
    source,
  });

  const debouncedInputValue = useDebounce<string>(inputValue, 500);

  useEffect(() => {
    field.onChange(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (!debouncedInputValue) {
      setOptions([]);
      return;
    }
    const fetch = async () => {
      const data: GeoJSON.FeatureCollection = await geocode(
        debouncedInputValue
      );
      setOptions(data.features);
    };
    fetch();
  }, [debouncedInputValue]);

  useEffect(() => {
    const fieldValue = get(record, source);
    if(!fieldValue) return;
    setInputValue(fieldValue.properties.display_name);
    setOptions([fieldValue]);
    setValue(fieldValue);
  }, [record, source]);

  const handleInputChange = async (
    event: React.SyntheticEvent<Element, Event>,
    value: string,
    reason: AutocompleteInputChangeReason
  ) => {
    setInputValue(value);
  };

  const handleChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: GeoJSON.Feature | null
  ) => {
    if (typeof value === "string") return;
    setValue(value);
  };

  return (
    <Autocomplete
      options={options}
      sx={{ width: 300 }}
      filterOptions={(options) => options}
      isOptionEqualToValue={(option, value) => {
        return option.properties?.place_id === value.properties?.place_id;
      }}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.properties?.place_id}>
            {option.properties?.display_name}
          </li>
        );
      }}
      getOptionLabel={(option) =>
        typeof option === "string" ? "TEST" : option.properties?.display_name
      }
      inputValue={inputValue}
      value={value}
      onInputChange={handleInputChange}
      onChange={handleChange}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
};

export default AddressAutoComplete;
