import MailOutlineIcon from '@mui/icons-material/MailOutline';
import withPermissions from "../withPermissions";
import Create from "./Create";
import Edit from "./Edit";
import List from "./List";

const mails = {
  name: "mails",
  list: List,
  create: Create,
  edit: Edit,
  icon: MailOutlineIcon,
};

export default withPermissions(mails);
