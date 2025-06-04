import UploadIcon from "@mui/icons-material/Upload";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  UrlFieldProps,
  sanitizeFieldRestProps,
  useDataProvider,
  useNotify,
} from "react-admin";
// @ts-ignore
import FileUpload, { ExtendedFileProps } from "react-mui-fileuploader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DataProvider } from "../dataProvider";

const RowErrorModal = ({
  open,
  onClose,
  rows,
}: {
  open: boolean;
  onClose: () => void;
  rows: any[][];
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{rows.length} lignes en erreur</DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  {row.map((cell, index) => (
                    <TableCell key={index}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const UploadField = ({ className, emptyText, ...rest }: Omit<UrlFieldProps, "source">) => {
  const [open, setOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [rowsInError, setRowsInError] = useState<any[][]>([]);
  const [fileToUpload, setFileToUpload] = useState<ExtendedFileProps | null>(
    null
  );
  const notify = useNotify();
  const [loading, setLoading] = useState(false);
  const dataProvider = useDataProvider<DataProvider>();

  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation(
    {
      mutationFn: (formData: FormData) => {
        return dataProvider.importUsers(formData);
      },
      onSuccess: () => {
        // invalidate users
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    }
  );

  const handleFileUploadError = (error: any) => {
    console.error(error);
  };

  const handleFilesChange = (files: ExtendedFileProps[]) => {
    setFileToUpload(files[0]);
  };

  const handleClose = (event: any) => {
    event.stopPropagation();
    setOpen(false);
  };

  const handleUpload = async (event: any) => {
    event.stopPropagation();
    setLoading(true);

    if (!fileToUpload) {
      return;
    }

    let formData = new FormData();
    formData.append("file", fileToUpload);

    try {
      const response = await mutateAsync(formData);
      const data = response.json;

      if (response.status === 200) {
        if (data.rowsInError && data.rowsInError.length > 0) {
          setRowsInError(data.rowsInError);
          setErrorModalOpen(true);
          notify(
            `Fichier partiellement importé (${data.addedCount} ajoutés, ${data.updatedCount} màj)`,
            { type: "warning" }
          );
          return;
        }
        notify(
          `Étudiants importés (${data.addedCount} ajoutés, ${data.updatedCount} màj)`,
          { type: "success" }
        );
      } else {
        notify(`Erreur d'import`, { type: "error" });
      }
    } catch (error: any) {
      console.error(error);
      notify(`Erreur d'envoi`, {
        type: "error",
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <RowErrorModal
        open={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        rows={rowsInError}
      />
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Import utilisateurs</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Importez un fichier Excel pour ajouter ou mettre à jour des
            utilisateurs. Format attendu:
            <Table
              sx={{
                "& th": {
                  fontWeight: "bold",
                  fontSize: "0.6rem",
                  padding: "4px",
                },
                "& td": {
                  whiteSpace: "nowrap",
                  fontSize: "0.6rem",
                  padding: "4px",
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Prénom</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Société / Cursus</TableCell>
                  <TableCell>Role</TableCell>
                </TableRow>
              </TableHead>
              <TableRow>
                <TableCell>Ferbach</TableCell>
                <TableCell>Florian</TableCell>
                <TableCell>florian@bleumatin.fr</TableCell>
                <TableCell>Bleu Matin</TableCell>
                <TableCell>external</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Kawohl</TableCell>
                <TableCell>Victoria</TableCell>
                <TableCell>victoria.kawohl@talm.fr</TableCell>
                <TableCell>TALM</TableCell>
                <TableCell>admin</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Dupont</TableCell>
                <TableCell>Jean</TableCell>
                <TableCell>jean.dupont@talm.fr</TableCell>
                <TableCell>3e année Design</TableCell>
                <TableCell>student</TableCell>
              </TableRow>
            </Table>
          </Typography>
          <Box sx={{ width: "100%", marginTop: "16px" }}>
            <FileUpload
              getBase64={false}
              multiFile={false}
              disabled={false}
              title=""
              header="Glissez un fichier ici"
              leftLabel="ou"
              buttonLabel="Parcourir"
              rightLabel="pour choisir un fichier"
              maxFileSize={50}
              maxUploadFiles={1}
              maxFilesContainerHeight={357}
              acceptedType={
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              }
              errorSizeMessage={"File seems too big"}
              onFilesChange={handleFilesChange}
              onError={handleFileUploadError}
              BannerProps={{ elevation: 0, variant: "outlined" }}
              showPlaceholderImage={false}
              LabelsGridProps={{
                md: 8,
                height: 250,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
              ContainerProps={{
                elevation: 0,
                variant: "outlined",
                sx: { p: 1 },
              }}
            />
          </Box>
        </DialogContent>
        <LoadingButton
          loading={loading}
          variant="contained"
          fullWidth
          disabled={!fileToUpload}
          sx={{ marginTop: "16px" }}
          onClick={handleUpload}
        >
          Importer ce fichier
        </LoadingButton>
      </Dialog>

      <Button
        onClick={(e: any) => {
          e.stopPropagation();
          setOpen(true);
        }}
        size="small"
        target="_blank"
        {...sanitizeFieldRestProps(rest)}
        style={{ lineHeight: "1.5" }}
        startIcon={<UploadIcon />}
      >
        Importer utilisateurs
      </Button>
    </>
  );
};

export default UploadField;
