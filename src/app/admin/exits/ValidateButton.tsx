import { Button } from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { DataProvider } from "../dataProvider";
import {
  Identifier,
  useDataProvider,
  useNotify,
  useRecordContext,
  useRefresh,
} from "react-admin";
import { useMutation } from "react-query";
import { MouseEvent } from "react";
import httpClient from "../httpClient";

const ValidateButton = () => {
  const record = useRecordContext();
  const refresh = useRefresh();
  const notify = useNotify();
  const dataProvider = useDataProvider<DataProvider>();

  const { mutateAsync, isLoading } = useMutation(() => {
    return dataProvider.validateExit(record.id);
  });

  if (!record) return null;
  if (record.validatedAt) return null;

  const handleValidateClicked = async (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await mutateAsync();
      refresh();
    } catch (e) {
      notify("Une erreur s'est produite", { type: "error" });
    }
  };

  return (
    <Button
      onClick={handleValidateClicked}
      disabled={isLoading}
      color="primary"
      variant="contained"
      startIcon={<TaskAltIcon />}
      size="small"
    >
      Valider
    </Button>
  );
};

export default ValidateButton;
