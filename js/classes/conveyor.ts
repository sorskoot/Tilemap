// Lets figure out a way to move an item from conveyor to conveyor around the world.

import { ServiceLocator, EventChannel } from '@sorskoot/wonderland-components';
import { ECSComponent } from './ECS/ECSComponent.js';
import { ECSEntity } from './ECS/ECSEntity.js';
import { NumberArray, Object3D } from '@wonderlandengine/api';
import { GlobalEvents } from './GlobalEvents.js';
import { Direction } from './Direction.js';

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

export type BuildingDescription = {
    id: number;
    name: string;
    prefab: string;
};

// Metadata/description for buildings
export interface BuildingMetaBase {
    prefab: string;
    createEntity(
        obj: Object3D,
        position: Readonly<NumberArray>,
        rotation: Readonly<NumberArray>
    ): ECSEntity;
    getDimensions(variant: number): [number, number];
    getAllVariants(): BuildingDescription[];
}

export abstract class BuildingMeta<T extends ECSEntity>
    implements BuildingMetaBase
{
    prefab: string;
    createEntity(
        obj: Object3D,
        position: Readonly<NumberArray>,
        rotation: Readonly<NumberArray>
    ): T {
        const entity = new ECSEntity() as T;
        entity.addComponent(new TransformComponent(obj, position, rotation));
        this.addComponents(entity);
        return entity;
    }

    getAllVariants(): BuildingDescription[] {
        throw new Error('Not implemented');
    }

    getDimensions(variant: number): [number, number] {
        return [1, 1];
    }

    protected abstract addComponents(entity: T): void;
}

// Conveyor building description
export class ConveyorMeta extends BuildingMeta<Conveyor> {
    // We can extend this with different variations and such later.
    prefab: string = 'Belt'; // reference to 3D model

    getAllVariants(): BuildingDescription[] {
        return [{ id: 1, name: 'Straight', prefab: this.prefab }];
    }

    protected addComponents(entity: Conveyor): void {
        entity.addComponent(new ConveyorComponent());
    }
}

export class MinerMeta extends BuildingMeta<Miner> {
    // We can extend this with different variations and such later.
    prefab: string = 'Miner'; // reference to 3D model

    getAllVariants(): BuildingDescription[] {
        return [{ id: 1, name: 'default', prefab: this.prefab }];
    }
    getDimensions(variant: number): [number, number] {
        return [2, 2];
    }
    protected addComponents(entity: Miner): void {}
}

export class ProcessorMeta extends BuildingMeta<Processor> {
    prefab: string = 'Processor'; // reference to 3D model

    getAllVariants(): BuildingDescription[] {
        return [{ id: 1, name: 'default', prefab: this.prefab }];
    }
    getDimensions(variant: number): [number, number] {
        return [2, 1];
    }
    protected addComponents(entity: Processor): void {}
}

export class StorageMeta extends BuildingMeta<Storage> {
    prefab: string = 'Storage'; // reference to 3D model

    getAllVariants(): BuildingDescription[] {
        return [{ id: 1, name: 'default', prefab: this.prefab }];
    }

    protected addComponents(entity: Storage): void {}
}

@ServiceLocator.register
export class BuildingRegistry {
    private items: Map<string, BuildingMetaBase> = new Map();

    register(name: string, item: BuildingMetaBase) {
        this.items.set(name, item);
    }

    get(name: string): BuildingMetaBase | undefined {
        return this.items.get(name);
    }
    constructor() {
        this.register('conveyor', new ConveyorMeta());
        this.register('miner', new MinerMeta());
        this.register('processor', new ProcessorMeta());
    }
}

export class Conveyor extends ECSEntity {
    get id(): string {
        return 'conveyor';
    }
    inventory: InventorySlot;

    update() {}
}

export class Miner extends ECSEntity {
    get id(): string {
        return 'miner';
    }
    output: InventorySlot;

    update() {}
}

export class Processor extends ECSEntity {
    get id(): string {
        return 'processor';
    }
    input: InventorySlot;
    output: InventorySlot;

    update() {}
}

export class Storage extends ECSEntity {
    get id(): string {
        return 'storage';
    }
    inventory: InventorySlot;
    update() {}
}

export class TransformComponent extends ECSComponent {
    get id(): string {
        return 'transform';
    }

    constructor(
        public obj: Object3D,
        public position: Readonly<NumberArray>,
        public rotation: Readonly<NumberArray>
    ) {
        super();
        // obj.setPositionWorld(position);
        // obj.setRotationWorld(rotation);
    }
}
export class ConveyorComponent extends ECSComponent {
    get id(): string {
        return 'conveyor';
    }
}

export abstract class FilteredSystem<T extends ECSComponent> {
    private componentType: { new (...args: any[]): T };

    constructor(componentType: { new (...args: any[]): T }) {
        this.componentType = componentType;
        // Listen to entity events
        // It would be nice if we can filter these somehow.
        // Maybe in a base class?
        // Not sure how, I don't think `if T instance of U' will work.
        const globalEvents = ServiceLocator.get(GlobalEvents);
        globalEvents.EntityPlaced.on(this.addComponent, this);
        globalEvents.EntityRemoved.on(this.removeComponent, this);
    }

    private addComponent = (entity: ECSEntity) => {
        //console.log('Entity placed', entity);

        // How do we know what is placed?
        // Shapez uses a registry of meta buildings, and just gets the one from there.
        // There are singletons, based on 'string'.

        if (entity.hasComponent(this.componentType)) {
            this.componentAdded(entity);
        }
    };

    private removeComponent = (entity: ECSEntity) => {
        this.componentRemoved(entity);
    };

    abstract componentAdded(entity: ECSEntity): void;
    abstract componentRemoved(entity: ECSEntity): void;
}

// Should this be a singleton?
export class ConveyorSystem extends FilteredSystem<ConveyorComponent> {
    private conveyors: ECSEntity[] = [];

    // should this listen to the entity events?
    // And add/remove conveyors as components get added?
    constructor() {
        super(ConveyorComponent);
    }

    update() {
        this.conveyors.forEach((conveyor) => {
            //conveyor.update();
        });
    }

    componentAdded(entity: ECSEntity): void {}
    componentRemoved(entity: ECSEntity): void {}
}

export function getGridPositions(
    size: [number, number],
    offset: [number, number],
    direction: Direction
): [number, number][] {
    const positions: [number, number][] = [];
    for (let x = 0; x < size[0]; x++) {
        for (let z = 0; z < size[1]; z++) {
            switch (direction) {
                case Direction.North:
                    positions.push([offset[0] - x, offset[1] + z]);
                    break;
                case Direction.East:
                    positions.push([offset[0] + z, offset[1] + x]);
                    break;
                case Direction.South:
                    positions.push([offset[0] + x, offset[1] - z]);
                    break;
                case Direction.West:
                    positions.push([offset[0] - z, offset[1] - x]);
                    break;
            }
        }
    }
    return positions;
}
