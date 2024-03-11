import { Button } from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { endpoint } from "../dataProvider";
import {
  Identifier,
  useNotify,
  useRecordContext,
  useRefresh,
} from "react-admin";
import { useMutation } from "react-query";
import { MouseEvent } from "react";
import httpClient from "../httpClient";

const validateExit = async (exitId: Identifier) => {
  return httpClient(`${endpoint}/exits/${exitId}/validate`, {
    method: "POST",
    body: "",
  });
};

const ValidateButton = () => {
  const record = useRecordContext();
  const refresh = useRefresh();
  const notify = useNotify();

  const { mutateAsync, isLoading } = useMutation(() => validateExit(record.id));

  if (!record) return null;
  if (record.validatedAt) return null;

  const handleValidateClicked = async (event: MouseEvent) => {
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
