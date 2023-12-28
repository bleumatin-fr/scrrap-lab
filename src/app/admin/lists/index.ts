import { EditGuesser, ListGuesser } from "react-admin";
import List from "./List";
import Create from "./Create";
import Edit from "./Edit";

const listRessourceFactory = (
  category: string,
) => {
  return {
    name: category,
    list: List,
    create: Create,
    edit: Edit,
    recordRepresentation: (record : any) => `${record.value}`
  };
};

export default listRessourceFactory;
