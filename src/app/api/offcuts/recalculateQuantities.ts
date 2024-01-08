import Entry from "../entries/Entry";
import Exit from "../exits/Exit";
import Offcut from "./Offcut";

const recalculateQuantities = async (offcutId: string) => {
  const offcut = await Offcut.findById(offcutId);
  if (!offcut) return;

  const entries = await Entry.find({ "offcuts.offcut": offcutId });

  const numberOfEntries = entries.reduce((acc, entry) => {
    const offcutQuantity = entry.offcuts.find(
      (offcutQuantity) => offcutQuantity.offcut.toString() === offcutId
    );
    if (!offcutQuantity) return acc;
    return acc + offcutQuantity.quantity;
  }, 0);

  const exits = await Exit.find({ "offcuts.offcut": offcutId });

  const numberOfExits = exits.reduce((acc, exit) => {
    const offcutQuantity = exit.offcuts.find(
      (offcutQuantity) => offcutQuantity.offcut.toString() === offcutId
    );
    if (!offcutQuantity) return acc;
    return acc + offcutQuantity.quantity;
  }, 0);

  await Offcut.updateOne(
    { _id: offcutId },
    { $set: { quantity: numberOfEntries - numberOfExits } }
  );
};

export default recalculateQuantities;
