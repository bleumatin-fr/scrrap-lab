import { connect } from "../db";
import List from "./List";
import matters from "./seeds/matters";
import materials from "./seeds/materials";
import audiences from "./seeds/audiences";
import brandPolicies from "./seeds/brandPolicies";
import colors from "./seeds/colors";
import investmentConditions from "./seeds/investmentConditions";
import investmentTypes from "./seeds/investmentTypes";
import qualities from "./seeds/qualities";
import sizes from "./seeds/sizes";
import transportModes from "./seeds/transportModes";
import transportReasons from "./seeds/transportReasons";

const data: {
  category: string;
  key: string;
  value: string;
  parent?: any;
  tags?: string[];
  order?: number;
}[] = [
  ...matters,
  ...materials,
  ...audiences,
  ...brandPolicies,
  ...colors,
  ...investmentConditions,
  ...investmentTypes,
  ...qualities,
  ...sizes,
  ...transportModes,
  ...transportReasons,
];

const seed = async () => {
  await connect();
  let lastCategory = "";
  let i = 0;
  for (const item of data) {
    if(item.category !== lastCategory) {
      i = 0;
    }
    if (item.parent) {
      const parent = await List.findOne(item.parent);
      if (!parent) {
        throw new Error(
          `Parent not found: ${item.parent.category} - ${item.parent.key}`
        );
      }
      item.parent = parent._id;
    }
    const existing = await List.findOne({
      category: item.category,
      key: item.key,
    });
    item.order = i;
    lastCategory = item.category;
    i++;
    if (existing) {
      existing.$set(item);
      await existing.save();
      continue;
    }
    const list = new List(item);
    await list.save();
  }
};

export default seed;
