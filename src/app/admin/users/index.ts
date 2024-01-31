import PersonIcon from "@mui/icons-material/Person";
import List from "./List";
import Edit from "./Edit";
import withPermissions from "../withPermissions";

const users = {
  name: "users",
  list: List,
  edit: Edit,
  icon: PersonIcon,
};

export default withPermissions(users);
