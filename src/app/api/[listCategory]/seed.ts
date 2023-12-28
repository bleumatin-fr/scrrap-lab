import { connect } from "../db";
import List from "./List";

const data = [
  {
    category: "matters",
    key: "plastic",
    value: "Plastique",
  },
  {
    category: "matters",
    key: "ceramic",
    value: "Céramique",
  },
  {
    category: "matters",
    key: "metallic",
    value: "Métallique",
  },
  {
    category: "matters",
    key: "organic",
    value: "Organique",
  },
  {
    category: "matters",
    key: "composite",
    value: "Composite",
  },
  // ...
  {
    category: "sizes",
    key: "small",
    value: "Petit",
  },
  {
    category: "sizes",
    key: "medium",
    value: "Moyen",
  },
  {
    category: "sizes",
    key: "large",
    value: "Grand",
  },
  // ...
  {
    category: "colors",
    key: "white",
    value: "Blanc",
  },
  {
    category: "colors",
    key: "black",
    value: "Noir",
  },
  {
    category: "colors",
    key: "multicolor",
    value: "Multicolore",
  },
  // ...
  {
    category: "qualities",
    key: "new",
    value: "Neuf",
    tags: ["new"],
  },
  {
    category: "qualities",
    key: "good",
    value: "Bon état",
    tags: ["second-hand"],
  },
  {
    category: "qualities",
    key: "medium",
    value: "État moyen",
    tags: ["second-hand"],
  },
  {
    category: "qualities",
    key: "bad",
    value: "Mauvais état",
    tags: ["second-hand"],
  },
  //...
  {
    category: "audiences",
    key: "internal",
    value: "Interne",
  },
  {
    category: "audiences",
    key: "public",
    value: "Public",
  },
  // ...
  {
    category: "brandPolicies",
    key: "yes",
    value: "Oui",
  },
  {
    category: "brandPolicies",
    key: "no",
    value: "Non",
  },
  {
    category: "brandPolicies",
    key: "notReadable",
    value: "Non lisible",
  },
  //...
  {
    category: "transportModes",
    key: "car",
    value: "Voiture",
  },
  {
    category: "transportModes",
    key: "van",
    value: "Camionnette",
  },
  {
    category: "transportModes",
    key: "cargo-bike",
    value: "Vélo cargo",
  },
  {
    category: "transportModes",
    key: "feet",
    value: "À pied",
  },
  {
    category: "transportModes",
    key: "public-transportation",
    value: "Transports publics",
  },
  //...
  {
    category: "transportReasons",
    key: "prospecting",
    value: "Prospection",
  },
  {
    category: "transportReasons",
    key: "collection",
    value: "Collecte / Transport matériaux",
  },
  {
    category: "transportReasons",
    key: "public-lecture",
    value: "Cours publique",
  },
  {
    category: "transportReasons",
    key: "workshop",
    value: "Atelier",
  },
  {
    category: "transportReasons",
    key: "open-house",
    value: "Magasin ouvert au public",
  },
  {
    category: "transportReasons",
    key: "internal-event",
    value: "Événement interne",
  },
];

const seed = async () => {
  await connect();
  return Promise.all(
    data.map(async (item) => {
      if (await List.findOne({ category: item.category, key: item.key })) {
        return;
      }
      const list = new List(item);
      await list.save();
    })
  );
};

export default seed;
