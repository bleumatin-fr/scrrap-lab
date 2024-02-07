import PersonIcon from "@mui/icons-material/Person";
import List from "./List";
import Edit from "./Edit";
import Create from "./Create";
import withPermissions from "../withPermissions";

const users = {
  name: "users",
  list: List,
  edit: Edit,
  create: Create,
  icon: PersonIcon,
  recordRepresentation: (record: any) => `${record.firstName} ${record.lastName} (${record.email})`,
};

export default withPermissions(users);
