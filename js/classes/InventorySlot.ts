// My though is that a conveyor is technically nothing more that an inventory that pushes an item
// to the next inventory in line. The animation of the item moving is just a visual effect.
// This approach would mean that the conveyor can be visualized as anything.
// I think that as soon as this basic chaining thing works,
// it will be come easier to expand on it.
// Questions/thoughts:
// - What if there is something in the inventory?
//   - Maybe the conveyor has 2 inventories?
//          One public and an internal one for the objects that are moving?
// - What if the next inventory is full?
//   - The conveyor should stop moving
// - A conveyor has a reference to the next inventory in line.
//   - How to handle curves? Is there a priority?
// - Maybe 'transport' is a better name than conveyor?
//   - Because the implementation could be a conveyor, a pipe, or even a person or vehicle
// - Some how the conveyor needs to know if it is placing in another converyor or something else
//          that has an inventory.
// - For now, conveyors need to go into splitters or mergers. No T-junctions.
// - The can curve 90 degrees, but not more.
// base for inventory slots

export class InventorySlot {}
