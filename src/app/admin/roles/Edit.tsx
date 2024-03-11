import {
  Edit,
  SimpleForm
} from "react-admin";
import { Fields } from "./Create";

const TransportEdit = () => (
  <Edit redirect="list" title="Modifier Role">
    <SimpleForm>
      <Fields />
    </SimpleForm>
  </Edit>
);

export default TransportEdit;
