import QueryStatsIcon from "@mui/icons-material/QueryStats";
import withPermissions from "../withPermissions";
import List from "./List";

const investments = {
  name: "metrics",
  list: List,
  icon: QueryStatsIcon,
};

export default withPermissions(investments);
