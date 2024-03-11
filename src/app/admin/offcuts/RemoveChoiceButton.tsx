import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { useInput } from "react-admin";

interface RemoveChoiceButtonProps {
  source: string;
  resetValue: any;
}

const RemoveChoiceButton = ({
  source,
  resetValue,
}: RemoveChoiceButtonProps) => {
  const { field } = useInput({
    source,
  });

  const handleClick = () => {
    field.onChange(resetValue);
  };

  return (
    <IconButton onClick={handleClick}>
      <CloseIcon />
    </IconButton>
  );
};

export default RemoveChoiceButton;
