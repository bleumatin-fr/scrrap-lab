import {
  Edit,
  SimpleForm
} from "react-admin";
import { Fields } from "./Create";

const TransportEdit = () => (
  <Edit redirect="list" title="Modifier Transport">
    <SimpleForm>
      <Fields />
    </SimpleForm>
  </Edit>
);

export default TransportEdit;
