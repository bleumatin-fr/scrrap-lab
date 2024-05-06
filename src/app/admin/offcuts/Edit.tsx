import { Edit, SimpleForm } from "react-admin";
import { addBasePathToOffcutPictures, Fields } from "./Create";

const OffcutEdit = () => {
  return (
    <Edit
      redirect="list"
      title="Modifier Chute"
      transform={addBasePathToOffcutPictures}
    >
      <SimpleForm>
        <Fields />
      </SimpleForm>
    </Edit>
  );
};

export default OffcutEdit;
