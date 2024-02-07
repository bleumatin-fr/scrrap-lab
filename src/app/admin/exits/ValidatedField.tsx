import { DateField, ReferenceField, useRecordContext } from "react-admin";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { Chip } from "@mui/material";
import ValidateButton from "./ValidateButton";
import styled from "@emotion/styled";

const ValidatedFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
    <ValidatedFieldContainer>
      <Chip color="success" icon={<TaskAltIcon />} label={label || "Validé"} />

      <ReferenceField
        source="validatedBy.id"
        reference="users"
        label="Validé par"
      />
      <DateField source="validatedAt" label="Validé le" showTime />
    </ValidatedFieldContainer>
  );
};

export default ValidatedField;
