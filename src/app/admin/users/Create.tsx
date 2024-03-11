import {
  Create,
  SimpleForm
} from "react-admin";
import { Fields } from "./Edit";

const OffcutCreate = () => {
  return (
    <Create redirect="list">
      <SimpleForm>
        <Fields />
      </SimpleForm>
    </Create>
  );
};

export default OffcutCreate;
