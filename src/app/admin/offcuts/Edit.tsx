import {
  Edit,
  SimpleForm
} from "react-admin";
import { Fields } from "./Create";

const OffcutEdit = () => {
  return (
    <Edit redirect="list" title="Modifier Chute">
      <SimpleForm>
        <Fields />
      </SimpleForm>
    </Edit>
  );
};

export default OffcutEdit;
