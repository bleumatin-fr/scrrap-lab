import List from "./List";
import Edit from "./Edit";
import Create from "./Create";
import OutputIcon from '@mui/icons-material/Output';
import withPermissions from "../withPermissions";

const entries = {
  name: "exits",
  list: List,
  edit: Edit,
  create: Create,
  icon: OutputIcon,
};

export default withPermissions(entries);
