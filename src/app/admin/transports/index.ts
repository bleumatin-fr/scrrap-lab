import { ListGuesser, EditGuesser } from "react-admin";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const transports = {
  name: "transports",
  list: ListGuesser,
  edit: EditGuesser,
  icon: LocalShippingIcon,
};

export default transports;
