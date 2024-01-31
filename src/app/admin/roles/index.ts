import withPermissions from "../withPermissions";
import Create from "./Create";
import Edit from "./Edit";
import List from "./List";
import GroupIcon from "@mui/icons-material/Group";

const users = {
  name: "roles",
  list: List,
  create: Create,
  edit: Edit,
  icon: GroupIcon,
};

export default withPermissions(users);
