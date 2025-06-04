import styled from "@emotion/styled";
import {
  ArrayField,
  AutocompleteInput,
  CheckboxGroupInput,
  Datagrid,
  DateField,
  EditButton,
  List,
  NumberField,
  ReferenceField,
  ReferenceInput,
  TextField,
  TextInput,
  usePermissions,
  useRecordContext,
} from "react-admin";
import ValidatedField from "./ValidatedField";
import { ReactElement } from "react";
import * as XLSX from "xlsx";

const SubDatagrid = styled(Datagrid)`
  table-layout: fixed;
  width: 500px;

  td:nth-child(1) {
    width: 120px;
  }
  td:nth-child(2) {
    width: 280px;
  }
  td:nth-child(3) {
    width: 100px;
  }
`;

interface EditButtonGuardProps {
  children: ReactElement;
}

const EditButtonGuard = ({ children }: EditButtonGuardProps) => {
  const record = useRecordContext();
  const { permissions } = usePermissions();

  if (permissions.includes("exits.edit")) {
    return children;
  }

  if (record?.validatedAt && permissions.includes("exits.edit-own")) {
    return null;
  }

  return children;
};

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

const ExitsList = () => {
  const { permissions } = usePermissions();

  const exporter = (records: any[]) => {
    const workbook = XLSX.utils.book_new();
    
    // Create offcuts sheet with all exit, offcut, and user details
    const offcutsData = records.flatMap(record => 
      record.offcuts?.map((offcut: any) => ({
        // Exit properties
        "Date de la sortie": new Date(record.date).toLocaleString(),
        // "Date de création de la sortie": new Date(record.createdAt).toLocaleString(),
        // "Date de mise à jour de la sortie": new Date(record.updatedAt).toLocaleString(),
        "Date de validation": record.validatedAt ? new Date(record.validatedAt).toLocaleString() : "",
        
        // User properties
        "Prénom de l'utilisateur": record.createdBy?.firstName,
        "Nom de l'utilisateur": record.createdBy?.lastName,
        "Email de l'utilisateur": record.createdBy?.email,
        "Rôle de l'utilisateur": record.createdBy?.role?.name,
        
        // Validator properties (if exists)
        "Prénom du validateur": record.validatedBy?.firstName,
        "Nom du validateur": record.validatedBy?.lastName,
        "Email du validateur": record.validatedBy?.email,
        "Rôle du validateur": record.validatedBy?.role?.name,
        
        // Offcut properties
        "Référence de la chute": offcut.offcut?.reference,
        "Nom de la chute": offcut.offcut?.name,
        "Poids sortie (kg)": (offcut.quantity / 1000).toFixed(3),
        "Matière": offcut.offcut?.matter?.value,
        "Matériau": offcut.offcut?.material?.value,
        "Tailles": offcut.offcut?.sizes?.map((s: any) => s.value).join(", "),
        "Couleurs": offcut.offcut?.colors?.map((c: any) => c.value).join(", "),
        "Qualités": offcut.offcut?.qualities?.map((q: any) => q.value).join(", "),
        "Audiences": offcut.offcut?.audiences?.map((a: any) => a.value).join(", "),
        "Politique de marque": offcut.offcut?.brandPolicy?.value,
        "Source": offcut.offcut?.source,
      })) || []
    );
    const offcutsSheet = XLSX.utils.json_to_sheet(offcutsData);
    XLSX.utils.book_append_sheet(workbook, offcutsSheet, "Chutes sorties");

    // Save the file
    XLSX.writeFile(workbook, "exits.xlsx");
  };

  return (
    <List filters={filters} sort={{ field: "date", order: "DESC" }} exporter={exporter}>
      <Datagrid rowClick={false}>
        <DateField source="date" label="Date" showTime />
        {permissions.includes("users.list") && (
          <ReferenceField
            source="createdBy.id"
            reference="users"
            label="Utilisateur"
          />
        )}
        <ArrayField source="offcuts" label="Chutes">
          <SubDatagrid bulkActionButtons={false}>
            <TextField
              source="offcut.reference"
              label="Référence"
              style={{ width: "100px" }}
            />
            <TextField
              source="offcut.name"
              label="Nom"
              style={{ width: "250px" }}
            />
            <NumberField
              source="quantity"
              label="Poids"
              transform={(value: any) => value / 1000}
              options={{ style: "unit", unit: "kilogram" }}
              style={{ width: "100px" }}
            />
          </SubDatagrid>
        </ArrayField>
        <ValidatedField source="validatedAt" label="Validé" />
        <EditButtonGuard>
          <EditButton />
        </EditButtonGuard>
      </Datagrid>
    </List>
  );
};

export default ExitsList;
