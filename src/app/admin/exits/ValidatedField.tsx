import { useRecordContext } from "react-admin";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { Chip } from "@mui/material";
import ValidateButton from "./ValidateButton";
import styled from "@emotion/styled";

const ValidatedFieldContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const ValidatedField = ({
  source,
  label,
}: {
  source?: string;
  label?: string;
}) => {
  const record = useRecordContext();
  if (!source) return null;
  if (!record) return null;

  if (!record[source]) {
    return <ValidateButton />;
  }

  return (
    <Chip color="success" icon={<TaskAltIcon />} label={label || "Validé"} />
  );
};

export default ValidatedField;
