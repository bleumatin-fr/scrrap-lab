import { useRecordContext } from "react-admin";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { Chip } from "@mui/material";

const ValidatedField = ({
  source,
  label,
}: {
  source?: string;
  label?: string;
}) => {
  const record = useRecordContext();
  if (!source) return null;
  if (!record || !record[source]) return null;

  return (
    <Chip color="success" icon={<TaskAltIcon />} label={label || "Validé"} />
  );
};

export default ValidatedField;
