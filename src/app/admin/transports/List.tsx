import {
  Datagrid,
  DateField,
  downloadCSV,
  EditButton,
  FetchRelatedRecords,
  FunctionField,
  List,
  NumberField,
  RaRecord,
  ReferenceField,
  ReferenceInput,
  TextField,
} from "react-admin";
import jsonExport from "jsonexport/dist";

const filters = [
  <ReferenceInput
    key="mode"
    source="mode"
    reference="transportModes"
    label="Mode"
    alwaysOn
  />,
];

const exporter = async (transports: any[], fetchRelatedRecords: FetchRelatedRecords) => {
  const reasons = await fetchRelatedRecords(transports, "reason", "transportReasons");
  const modes = await fetchRelatedRecords(transports, "mode", "transportModes");

  const transportsForExport = transports.map(transport => {
    return {
      id: transport.id,
      date: transport.date,
      mode: modes[transport.mode]?.value,
      distance: transport.distance,
      weight: transport.weight,
      passengers: transport.passengers,
      reason: reasons[transport.reason]?.value,
      from: transport.from?.properties.display_name,
      to: transport.to?.properties.display_name,
    };
  });
  jsonExport(transportsForExport, {
      headers: ['id', 'date', 'mode', 'distance', 'weight', 'passengers', 'reason', 'from', 'to']
  }, (err: any, csv: any) => {
      downloadCSV(csv, 'transports');
  });
};

const TransportList = () => (
  <List filters={filters} sort={{ field: "createdAt", order: "DESC" }} exporter={exporter}>
    <Datagrid rowClick={false}>
      <DateField source="date" label="Date" />
      <ReferenceField source="mode" reference="transportModes" label="Mode" />
      <NumberField
        source="distance"
        label="Distance"
        options={{ style: "unit", unit: "kilometer" }}
      />
      <NumberField
        source="weight"
        label="Poids"
        transform={(value: any) => value / 1000}
        options={{ style: "unit", unit: "kilogram" }}
      />
      <NumberField source="passengers" label="Nombre de passagers" />
      <ReferenceField
        source="reason"
        reference="transportReasons"
        label="Raison"
      />
      <TextField source="from.properties.name" label="Départ" />
      <TextField source="to.properties.name" label="Destination" />
      <EditButton />
    </Datagrid>
  </List>
);

export default TransportList;
