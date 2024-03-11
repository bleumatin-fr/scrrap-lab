import List from "./List";
import Edit from "./Edit";
import Create from "./Create";
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import withPermissions from "../withPermissions";

const investments = {
  name: "investments",
  list: List,
  edit: Edit,
  create: Create,
  icon: PrecisionManufacturingIcon,
};

export default withPermissions(investments);
