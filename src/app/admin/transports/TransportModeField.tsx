import TransportMode from "@/app/api/transports/TransportMode";
import React from "react";
import {
  SelectField,
  SelectFieldProps,
} from "react-admin";

type TransportModeFieldProps = Omit<SelectFieldProps, "choices">;

const TransportModeField = (props: TransportModeFieldProps) => {
  const choices = Object.keys(TransportMode).map((mode, index) => ({
    id: mode,
    name: Object.values(TransportMode)[index],
  }));
  return <SelectField {...props} choices={choices} />;
};

export default TransportModeField;
