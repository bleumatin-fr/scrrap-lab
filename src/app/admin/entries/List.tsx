import styled from "@emotion/styled";
import {
  ArrayField,
  AutocompleteInput,
  Datagrid,
  DateField,
  EditButton,
  FunctionField,
  List,
  NumberField,
  ReferenceField,
  ReferenceInput,
  TextField,
  TextInput,
  useListContext,
} from "react-admin";
import * as XLSX from "xlsx";

const filters = [
  <TextInput
    key="reference-input"
    source="offcuts.reference"
    alwaysOn
    label="Référence de chute"
  />,
  <ReferenceInput
    key="user-input"
    source="createdBy.id"
    reference="users"
    alwaysOn
  >
    <AutocompleteInput
      label="Créé par"
      optionText={(choice: any) => `${choice.firstName} ${choice.lastName}`}
    />
  </ReferenceInput>,
];

const OffcutDatagrid = styled(Datagrid)`
  table-layout: fixed;
  width: 450px;

  td:nth-child(1) {
    width: 100px;
  }
  td:nth-child(2) {
    width: 280px;
  }
  td:nth-child(3) {
    width: 80px;
  }
`;

const TransportDatagrid = styled(Datagrid)`
  table-layout: fixed;
  width: 450px;

  td:nth-child(1) {
    width: 100px;
  }
  td:nth-child(2) {
    width: 230px;
  }
  td:nth-child(3) {
    width: 120px;
  }
`;

const EntriesList = () => {
  const exporter = (records: any[]) => {
    const workbook = XLSX.utils.book_new();
    
    // Create offcuts sheet with all entry, offcut, and user details
    const offcutsData = records.flatMap(record => 
      record.offcuts?.map((offcut: any) => ({
        // Entry properties
        // "ID de l'entrée": record.id,
        "Date de l'entrée": new Date(record.date).toLocaleString(),
        // "Date de création de l'entrée": new Date(record.createdAt).toLocaleString(),
        // "Date de mise à jour de l'entrée": new Date(record.updatedAt).toLocaleString(),
        "Nombre de transports": record.transports?.length || 0,
        
        // User properties
        // "ID de l'utilisateur": record.createdBy?.id,
        "Prénom de l'utilisateur": record.createdBy?.firstName,
        "Nom de l'utilisateur": record.createdBy?.lastName,
        "Email de l'utilisateur": record.createdBy?.email,
        // "Méta de l'utilisateur": record.createdBy?.meta,
        "Rôle de l'utilisateur": record.createdBy?.role?.name,
        // "Date de création de l'utilisateur": record.createdBy?.createdAt ? new Date(record.createdBy.createdAt).toLocaleString() : "",
        // "Date de mise à jour de l'utilisateur": record.createdBy?.updatedAt ? new Date(record.createdBy.updatedAt).toLocaleString() : "",
        
        // Offcut properties
        // "ID de la chute": offcut.offcut?.id,
        "Référence de la chute": offcut.offcut?.reference,
        "Nom de la chute": offcut.offcut?.name,
        "Poids de la chute (kg)": (offcut.quantity / 1000).toFixed(3),
        "Matière": offcut.offcut?.matter?.value,
        "Matériau": offcut.offcut?.material?.value,
        "Tailles": offcut.offcut?.sizes?.map((s: any) => s.value).join(", "),
        "Couleurs": offcut.offcut?.colors?.map((c: any) => c.value).join(", "),
        "Qualités": offcut.offcut?.qualities?.map((q: any) => q.value).join(", "),
        "Audiences": offcut.offcut?.audiences?.map((a: any) => a.value).join(", "),
        "Politique de marque": offcut.offcut?.brandPolicy?.value,
        "Source": offcut.offcut?.source,
        // "Date de création de la chute": new Date(offcut.offcut?.createdAt).toLocaleString(),
        // "Date de mise à jour de la chute": new Date(offcut.offcut?.updatedAt).toLocaleString(),
      })) || []
    );
    const offcutsSheet = XLSX.utils.json_to_sheet(offcutsData);
    XLSX.utils.book_append_sheet(workbook, offcutsSheet, "Chutes entrées");

    // Create transports sheet with all entry, transport, and user details
    const transportsData = records.flatMap(record =>
      record.transports?.map((transport: any) => ({
        // Entry properties
        // "ID de l'entrée": record.id,
        "Date de l'entrée": new Date(record.date).toLocaleString(),
        // "Date de création de l'entrée": new Date(record.createdAt).toLocaleString(),
        // "Date de mise à jour de l'entrée": new Date(record.updatedAt).toLocaleString(),
        "Nombre de chutes": record.offcuts?.length || 0,
        
        // User properties
        // "ID de l'utilisateur": record.createdBy?.id,
        "Prénom de l'utilisateur": record.createdBy?.firstName,
        "Nom de l'utilisateur": record.createdBy?.lastName,
        "Email de l'utilisateur": record.createdBy?.email,
        // "Méta de l'utilisateur": record.createdBy?.meta,
        "Rôle de l'utilisateur": record.createdBy?.role?.name,
        // "Date de création de l'utilisateur": record.createdBy?.createdAt ? new Date(record.createdBy.createdAt).toLocaleString() : "",
        // "Date de mise à jour de l'utilisateur": record.createdBy?.updatedAt ? new Date(record.createdBy.updatedAt).toLocaleString() : "",
        
        // Transport properties
        // "ID du transport": transport.id,
        "Date du transport": new Date(transport.date).toLocaleString(),
        "Mode de transport": transport.mode?.value,
        "Distance (km)": transport.distance || "",
        "Poids entrée (kg)": transport.weight ? (transport.weight / 1000).toFixed(3) : "",
        "Nombre de passagers": transport.passengers || "",
        "Raison du transport": transport.reason?.value,
        "Lieu de départ": transport.from?.properties.name || "Inconnu",
        "Lieu d'arrivée": transport.to?.properties.name || "Inconnu",
        // "Date de création du transport": new Date(transport.createdAt).toLocaleString(),
        // "Date de mise à jour du transport": new Date(transport.updatedAt).toLocaleString(),
      })) || []
    );
    const transportsSheet = XLSX.utils.json_to_sheet(transportsData);
    XLSX.utils.book_append_sheet(workbook, transportsSheet, "Transports");

    // Save the file
    XLSX.writeFile(workbook, "entries.xlsx");
  };

  return (
    <List filters={filters} sort={{ field: "date", order: "DESC" }} exporter={exporter}>
      <Datagrid rowClick={false}>
        <DateField source="date" label="Date" showTime />
        <ReferenceField
          source="createdBy.id"
          reference="users"
          label="Utilisateur"
        />
        <ArrayField source="offcuts" label="Chutes">
          <OffcutDatagrid bulkActionButtons={false}>
            <TextField source="offcut.reference" label="Référence" />
            <TextField source="offcut.name" label="Nom" />
            <NumberField
              source="quantity"
              label="Poids"
              transform={(value: any) => value / 1000}
              options={{ style: "unit", unit: "kilogram" }}
            />
          </OffcutDatagrid>
        </ArrayField>
        <ArrayField source="transports" label="Transports">
          <TransportDatagrid bulkActionButtons={false}>
            <DateField source="date" label="Date" />
            <FunctionField
              label="Mode / Raison"
              render={(record: any) => (
                <>
                  <div>{record.mode?.value}</div>
                  <div>{record.reason?.value}</div>
                </>
              )}
            />
            <FunctionField
              label="Trajet"
              render={(record: any) => (
                <>
                  {record.from?.properties.name && record.to?.properties.name && (
                    <div>
                      {record.from?.properties.name || "Inconnu"} {" => "}
                      {record.to?.properties.name || "Inconnu"}
                    </div>
                  )}
                  {record.distance && <div>{record.distance} km</div>}
                  {record.weight && (
                    <div>{(record.weight / 1000).toFixed(3)} kg</div>
                  )}
                  {record.passengers && <div>{record.passengers} passagers</div>}
                </>
              )}
            />
          </TransportDatagrid>
        </ArrayField>
        <EditButton />
      </Datagrid>
    </List>
  );
};

export default EntriesList;
