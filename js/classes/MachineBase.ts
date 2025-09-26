// Rough sketch of Factory Automation game classes

import { AtomSystem } from '@sorskoot/wonderland-components/atomECS';

// Thoughts:
// - Shapez has Buildings, Components, Items and Systems
//   - But combines them: There's a BeltBuilding, a BeltComponent and a BeltSystem
//   - Minecraft has Blocks, which can be BlocksWithTicks and BlocksWithInventories
// - I like inheritance, maybe it should have interfaces?
// Or composition? (Composition = Components, Inheritance = Base classes)
//   - Composition with TypeScript Mixins? (It's tough but nice)
// - Prepare logic for worker threads.

// Questions/Conciderations:
// - Do all machines have inputs and outputs?
// - How to handle power? Or is that just an input?
// - Is 'machine' the correct name? Technically there are games where a machine
//   can be a building, or something else.
// - Is a belt a machine? And a container?
// - Somehow these need to monitor changes to their neighbors, or have function
// that could be called when a neighbor changes.
export class MachineBase {
    public id: string;
    public name: string;

    public tick(): void {}
    public neighborChanged(neighbor: any): void {}
}

// Questions/Conciderations:
// - Are ores, liquids, gasses and power all items?
export class ItemBase {}

// Questions/Conciderations:
// - Transport can be belts, pipes, wires, drones, people, etc. Just something that moves
// items from a A to B in some way with some capacity and speed.
// - Biggest challenge is how do these work together as belts/pipes?
//  - Do these need to be an inherited class?
// - Same for people/drones/vehicles?
// - How things actually connect to eachother is for another class.
// - Does a transport need an inventory?
export class TransportBase extends MachineBase {}

abstract class TransportSystem extends AtomSystem {
    abstract updatePaths();
    abstract tryPlaceItem(item, position);
    abstract updateMovement();
    // ... other common methods
}

export class BeltSystem extends TransportSystem {
    updatePaths() {}
    tryPlaceItem(item: any, position: any) {}
    updateMovement() {}
    update(delta: number): void {}
    // Implement belt-specific logic
}
