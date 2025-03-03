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

  if (record.validatedAt && permissions.includes("exits.edit-own")) {
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

  return (
    <List filters={filters} sort={{ field: "date", order: "DESC" }}>
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
