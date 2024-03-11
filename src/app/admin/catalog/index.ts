import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import List from "./List";
import withPermissions from "../withPermissions";

const offcuts = {
  name: "catalog",
  list: List,
  icon: AutoStoriesIcon,
};

export default withPermissions(offcuts);
