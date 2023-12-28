import seedLists from "./app/api/[listCategory]/seed";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await seedLists();
    console.log("Lists seeded");
  }
}
