import withPermissions from "../withPermissions";
import Create from "./Create";
import Edit from "./Edit";
import List from "./List";

const listRessourceFactory = (category: string) => {
  return withPermissions({
    name: category,
    list: List,
    create: Create,
    edit: Edit,
    recordRepresentation: (record: any) => `${record.value}`,
    options: {
      permissionKey: "edit",
    },
  });
};

export default listRessourceFactory;
