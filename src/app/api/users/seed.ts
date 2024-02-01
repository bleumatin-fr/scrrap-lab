import { connect } from "../db";
import Role from "../roles/Role";
import User from "./User";

const defaultUsers = [
  {
    email: "admin@bleumatin.fr",
    firstName: "Administrateur",
    lastName: "Bleu Matin",
    company: "Bleu Matin",
    // = password
    hash: "$2b$10$Zq2Q6Chp53thAJnB0h0LJ.HQ6.7LmmpBSFVSUQMk1FCN8R.OXivyS",
    role: "admin",
  },
  {
    email: "student@bleumatin.fr",
    firstName: "Étudiant",
    lastName: "TEST",
    company: "",
    // = password
    hash: "$2b$10$Zq2Q6Chp53thAJnB0h0LJ.HQ6.7LmmpBSFVSUQMk1FCN8R.OXivyS",
    role: "student",
  },
  {
    email: "external@bleumatin.fr",
    firstName: "Externe",
    lastName: "TEST",
    company: "Entreprise",
    // = password
    hash: "$2b$10$Zq2Q6Chp53thAJnB0h0LJ.HQ6.7LmmpBSFVSUQMk1FCN8R.OXivyS",
    role: "external",
  },
];

const seed = async () => {
  await connect();

  for (const user of defaultUsers) {
    const existingUser = await User.findOne({ email: user.email });
    if (!existingUser) {
      const userRole = await Role.findOne({
        name: user.role,
      });
      if (!userRole) {
        console.error(`Could not seed user, no role ${user.role} exists`);
      }
      await User.create({
        ...user,
        role: userRole,
      });
    }
  }
};

export default seed;
