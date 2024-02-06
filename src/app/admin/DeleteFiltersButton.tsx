import { Button, IconButton } from "@mui/material";
import { Filter, useListContext } from "react-admin";
import ClearIcon from "@mui/icons-material/Clear";
interface DeleteFiltersButtonProps {}

const DeleteFiltersButton = ({}: DeleteFiltersButtonProps) => {
  const { setFilters } = useListContext();

  const handleClick = () => {
    setFilters({}, {}, false);
  };

  return (
    <IconButton onClick={handleClick} title="Réinitialiser les filtres">
      <ClearIcon />
    </IconButton>
  );
};

export default DeleteFiltersButton;
