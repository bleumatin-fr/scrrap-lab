import ExtensionIcon from "@mui/icons-material/Extension";
import Create from "./Create";
import Edit from "./Edit";
import List from "./List";
import withPermissions from "../withPermissions";

const offcuts = {
  name: "offcuts",
  list: List,
  create: Create,
  edit: Edit,
  icon: ExtensionIcon,
};

export default withPermissions(offcuts);
