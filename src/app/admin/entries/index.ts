import List from "./List";
import Edit from "./Edit";
import Create from "./Create";
import InputIcon from "@mui/icons-material/Input";
import withPermissions from "../withPermissions";

const entries = {
  name: "entries",
  list: List,
  edit: Edit,
  create: Create,
  icon: InputIcon,
};

export default withPermissions(entries);
