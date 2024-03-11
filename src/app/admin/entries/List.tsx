import styled from "@emotion/styled";
import { ReactElement } from "react";
import {
  ArrayField,
  Datagrid,
  DateField,
  EditButton,
  FunctionField,
  List,
  NumberField,
  ReferenceArrayField,
  ReferenceField,
  ReferenceInput,
  TextField,
} from "react-admin";

const filters: ReactElement[] = [];

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

const EntriesList = () => (
  <List filters={filters} sort={{ field: "date", order: "DESC" }}>
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
            transform={(value) => value / 1000}
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
                {record.distance && (
                  <div>{record.distance} km</div>
                )}
                {record.weight && <div>{record.weight} kg</div>}
                {record.passengers && (
                  <div>{record.passengers} passagers</div>
                )}
              </>
            )}
          />
        </TransportDatagrid>
      </ArrayField>
      <EditButton />
    </Datagrid>
  </List>
);

export default EntriesList;
