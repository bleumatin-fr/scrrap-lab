import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { MouseEvent, useState } from "react";

import { ReferenceField, SimpleForm, TextField, useInput } from "react-admin";
import { useWatch } from "react-hook-form";
import { Fields as TransportFields } from "../transports/Create";

const TransportStep = () => {
  const [addTransportModalOpen, setAddTransportModalOpen] = useState(false);

  const { field } = useInput({
    source: "transports",
    defaultValue: [],
  });

  const handleTransportFormSubmitted = (data: any) => {
    field.onChange([
      ...field.value,
      { ...data, id: field.value.length, new: true },
    ]);
    setAddTransportModalOpen(false);
  };
  const date = useWatch({ name: "date" });

  return (
    <>
      <Dialog
        open={addTransportModalOpen}
        onClose={() => setAddTransportModalOpen(false)}
        fullWidth
      >
        <DialogTitle>Ajout transport</DialogTitle>

        <SimpleForm
          onSubmit={handleTransportFormSubmitted}
          defaultValues={{
            date,
          }}
        >
          <TransportFields />
        </SimpleForm>
      </Dialog>
      <Card>
        <CardContent>
          <Typography variant="h6" component="div">
            Transports
          </Typography>
          <Button
            onClick={() => setAddTransportModalOpen(true)}
            startIcon={<AddCircleOutlineIcon />}
          >
            Ajouter un transport
          </Button>
          <DataGrid
            rows={field.value}
            disableColumnFilter
            disableColumnMenu
            disableRowSelectionOnClick
            columns={[
              {
                field: "date",
                headerName: "Date",
                width: 150,
                sortable: false,
              },
              {
                field: "mode",
                headerName: "Mode",
                width: 150,
                sortable: false,
                renderCell: (params) => {
                  return (
                    <ReferenceField
                      record={params.row}
                      source="mode.id"
                      reference="transportModes"
                      link={false}
                    >
                      <TextField source="value" />
                    </ReferenceField>
                  );
                },
              },
              {
                field: "consumption",
                headerName: "Consommation",
                width: 150,
                sortable: false,
              },
              {
                field: "distance",
                headerName: "Distance",
                width: 150,
                sortable: false,
              },
              {
                field: "weight",
                headerName: "Poids",
                width: 150,
                sortable: false,
              },
              {
                field: "passengers",
                headerName: "Nb. passagers",
                width: 150,
                sortable: false,
              },
              {
                field: "reason",
                headerName: "Raison",
                width: 150,
                sortable: false,
                renderCell: (params) => {
                  return (
                    <ReferenceField
                      record={params.row}
                      source="reason.id"
                      reference="transportReasons"
                      link={false}
                    >
                      <TextField source="value" />
                    </ReferenceField>
                  );
                },
              },
              {
                field: "from",
                headerName: "Trajet",
                width: 150,
                sortable: false,
                renderCell: (params) => {
                  return `${params.row.from?.properties.name || "Inconnu"} => ${
                    params.row.to?.properties.name || "Inconnu"
                  }`;
                },
              },
              {
                field: "action",
                headerName: "",
                sortable: false,
                renderCell: (params) => {
                  const onClick = (e: MouseEvent) => {
                    field.onChange(
                      field.value.filter(
                        (item: any) => item.id !== params.row.id
                      )
                    );
                  };

                  return (
                    <IconButton onClick={onClick}>
                      <DeleteIcon />
                    </IconButton>
                  );
                },
              },
            ]}
            autoHeight
          />
        </CardContent>
      </Card>
    </>
  );
};

export default TransportStep;
