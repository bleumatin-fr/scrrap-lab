import TransportMode from "@/app/api/transports/TransportMode";
import React from "react";
import { SelectInput, SelectInputProps } from "react-admin";

type TransportModeInputProps = Omit<SelectInputProps, "choices">;

const TransportModeInput = (props: TransportModeInputProps) => {
  const choices = Object.keys(TransportMode).map((mode, index) => ({
    id: mode,
    name: Object.values(TransportMode)[index],
  }));
  return <SelectInput {...props} choices={choices} />;
};

export default TransportModeInput;
