import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Create from "./Create";
import Edit from "./Edit";
import List from "./List";
import withPermissions from "../withPermissions";


const transports = {
  name: "transports",
  list: List,
  edit: Edit,
  create: Create,
  icon: LocalShippingIcon,
};

export default withPermissions(transports);
