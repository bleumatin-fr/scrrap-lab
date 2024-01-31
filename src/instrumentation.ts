import seedLists from "./app/api/[listCategory]/seed";
import seedRoles from "./app/api/roles/seed";
import seedUsers from "./app/api/users/seed";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await seedLists();
    console.log("Lists seeded");
    await seedRoles();
    console.log("Roles seeded");
    await seedUsers();
    console.log("Users seeded");
  }
}
