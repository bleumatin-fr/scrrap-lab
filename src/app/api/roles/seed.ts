import { connect } from "../db";
import Role from "../roles/Role";
import availableActions from "./availableActions";

const visitorActions = [
  "catalog.list",
  "catalog.cart",
  "qualities.list",
  "matters.list",
  "materials.list",
  "brandPolicies.list",
  "colors.list",
  "sizes.list",
  "exits.list-own",
  "exits.edit-own",
  "exits.delete-own",
  "offcuts.list",
];

const defaultRoles = [
  {
    name: "admin",
    actions: availableActions,
  },
  {
    name: "student",
    actions: [
      ...visitorActions,
      "catalog.list-private",
      "offcuts.list-private",
    ],
  },
  {
    name: "external",
    actions: visitorActions,
  },
];

const seed = async () => {
  await connect();

  for (const role of defaultRoles) {
    const existingRole = await Role.findOne({ name: role.name });
    if (!existingRole) {
      await Role.create(role);
    }
  }
};

export default seed;
