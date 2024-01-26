import styled from "@emotion/styled";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { ChangeEvent, MouseEvent, useState } from "react";
import { SimpleForm, useGetList, useInput } from "react-admin";
import Alert from "@mui/material/Alert";
import { CartItem } from "./CartItem";
import { Fields as OffcutFields } from "../offcuts/Create";
import WeightField from "../WeightField";

const Layout = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  width: 100%;
  > * {
    flex-grow: 1;
    width: 50%;
  }
`;

const Catalog = () => {
  const [addOffcutModalOpen, setAddOffcutModalOpen] = useState(false);
  const { field } = useInput({
    source: "offcuts",
    defaultValue: [],
  });

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 1,
    pageSize: 10,
  });

  const { data, total, isLoading, error, refetch } = useGetList("offcuts", {
    pagination: {
      page: paginationModel.page,
      perPage: paginationModel.pageSize,
    },
    filter: {
      meta: {
        populate: ["matter", "material", "sizes", "colors", "quality"],
      },
    },
  });

  const handlePaginationModelChange = (
    paginationModel: GridPaginationModel
  ) => {
    setPaginationModel(paginationModel);
  };

  const handleOffcutFormSubmitted = (data: any) => {
    // field.onChange([
    //   ...field.value,
    //   { ...data, id: field.value.length, new: true },
    // ]);
    setAddOffcutModalOpen(false);
  };

  return (
    <div>
      <Dialog
        open={addOffcutModalOpen}
        onClose={() => setAddOffcutModalOpen(false)}
        fullWidth
      >
        <DialogTitle>Ajout chute</DialogTitle>
        <SimpleForm onSubmit={handleOffcutFormSubmitted}>
          <OffcutFields />
        </SimpleForm>
      </Dialog>
      <DataGrid
        paginationModel={paginationModel}
        rowSelection={false}
        rowCount={total || 0}
        loading={isLoading}
        onPaginationModelChange={handlePaginationModelChange}
        disableColumnFilter
        disableColumnMenu
        disableRowSelectionOnClick
        columns={[
          {
            field: `reference`,
            headerName: "Référence",
            flex: 1,
          },
          { field: `name`, headerName: "Nom", flex: 1 },
          {
            field: `matter`,
            headerName: "Matière",
            flex: 1,
            valueGetter: (params) => params.row.matter?.value,
          },
          {
            field: `material`,
            headerName: "Matériaux",
            flex: 1,
            valueGetter: (params) => params.row.material?.value,
          },
          {
            field: `quality`,
            headerName: "Qualité",
            flex: 1,
            valueGetter: (params) => params.row.quality?.value,
          },
          {
            field: `sizes`,
            headerName: "Taille",
            flex: 1,
            valueGetter: (params) =>
              params.row.sizes?.map((size: any) => size.value).join(", "),
          },
          {
            field: `colors`,
            headerName: "Couleur",
            flex: 1,
            valueGetter: (params) =>
              params.row.colors?.map((color: any) => color.value).join(", "),
          },
          {
            field: "action",
            headerName: "Action",
            sortable: false,
            renderCell: (params) => {
              const onClick = (e: MouseEvent) => {
                if (
                  field.value.find(
                    (item: any) => item.offcut.id === params.row.id
                  )
                ) {
                  return;
                }
                field.onChange([
                  ...field.value,
                  {
                    id: params.row.id,
                    offcut: params.row,
                    quantity: 1,
                  },
                ]);
              };

              return (
                <IconButton onClick={onClick}>
                  <AddShoppingCartIcon />
                </IconButton>
              );
            },
          },
        ]}
        autoHeight
        rows={data || []}
      />
    </div>
  );
};

const ValidationErrorSpecialFormatPrefix = "@@react-admin@@";

const Cart = () => {
  const { field, fieldState } = useInput({
    source: "offcuts",
    validate: (value: CartItem[]) => {
      if (value.length === 0) {
        return "Vous devez ajouter au moins une chute";
      }
    },
  });
  const value: CartItem[] = field.value;

  return (
    <div>
      <DataGrid
        pagination={undefined}
        rowCount={value.length || 0}
        disableColumnFilter
        disableColumnMenu
        hideFooter
        disableRowSelectionOnClick
        columns={[
          {
            field: `offcut.reference`,
            headerName: "Référence",
            flex: 1,
            valueGetter: (params) => params.row.offcut.reference,
          },
          {
            field: `offcut.name`,
            headerName: "Nom",
            flex: 1,
            valueGetter: (params) => params.row.offcut.name,
          },
          // {
          //   field: `offcut.matter`,
          //   headerName: "Matière",
          //   flex: 1,
          //   valueGetter: (params) => params.row.offcut.material.value,
          // },
          // {
          //   field: `offcut.material`,
          //   headerName: "Matériaux",
          //   flex: 1,
          //   valueGetter: (params) => params.row.offcut.material.value,
          // },
          // {
          //   field: `offcut.quality`,
          //   headerName: "Qualité",
          //   flex: 1,
          //   valueGetter: (params) => params.row.offcut.quality?.value,
          // },
          // {
          //   field: `offcut.sizes`,
          //   headerName: "Taille",
          //   flex: 1,
          //   valueGetter: (params) =>
          //     params.row.offcut.sizes
          //       ?.map((size: any) => size.value)
          //       .join(", "),
          // },
          // {
          //   field: `offcut.colors`,
          //   headerName: "Couleur",
          //   flex: 1,
          //   valueGetter: (params) =>
          //     params.row.offcut.colors
          //       ?.map((color: any) => color.value)
          //       .join(", "),
          // },
          {
            field: "quantity",
            headerName: "Poids",
            sortable: false,
            width: 250,
            renderCell: (params) => {
              const onChange = (value: number) => {
                if (isNaN(value)) {
                  return;
                }
                field.onChange(
                  field.value.map((item: any) => {
                    if (item.id === params.row.id) {
                      return {
                        ...item,
                        quantity: value,
                      };
                    }
                    return item;
                  })
                );
              };

              return (
                <WeightField
                  type="number"
                  onChange={onChange}
                  value={params.row.quantity}
                />
              );
            },
          },
          {
            field: "action",
            headerName: "",
            sortable: false,
            renderCell: (params) => {
              const onClick = (e: MouseEvent) => {
                field.onChange(
                  field.value.filter((item: any) => item.id !== params.row.id)
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
        rows={value || []}
      />
      {fieldState.error && (
        <Alert severity="error">
          {fieldState.error.message?.substring(
            ValidationErrorSpecialFormatPrefix.length
          )}
        </Alert>
      )}
    </div>
  );
};

const OffcutStep = ({ type }: { type: "entry" | "exit" }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div">
          Chutes
        </Typography>
        <Layout>
          <Box>
            <Typography variant="body2">Catalogue</Typography>
            <Catalog />
            <Button
              variant="text"
              onClick={() => {}}
              startIcon={<AddCircleOutlineIcon />}
              fullWidth
            >
              Ajouter une nouvelle chute
            </Button>
          </Box>
          <Box>
            <Typography variant="body2">
              Chutes {type === "entry" ? "collectées" : "sorties"}
            </Typography>
            <Cart />
          </Box>
        </Layout>
      </CardContent>
    </Card>
  );
};

export default OffcutStep;
