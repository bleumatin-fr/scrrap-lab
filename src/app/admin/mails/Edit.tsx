import {
  Edit,
  SimpleForm
} from "react-admin";
import { Fields } from "./Create";

const MailEdit = () => (
  <Edit redirect="list" title="Modifier Mail">
    <SimpleForm>
      <Fields />
    </SimpleForm>
  </Edit>
);

export default MailEdit;
