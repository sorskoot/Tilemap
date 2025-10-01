// Lets figure out a way to move an item from conveyor to conveyor around the world.

import { EventChannel } from '@sorskoot/wonderland-components';
import { ECSComponent } from '../ECS/ECSComponent.js';
import { ECSEntity } from '../ECS/ECSEntity.js';
import { InventorySlot } from '../InventorySlot.js';
import { BuildingDescription } from '../BuildingDescription.js';
import { BuildingMeta } from '../BuildingMeta.js';
import { Processor } from './Processor.js';
import { Storage } from './Storage.js';
import { FilteredSystem } from '../FilteredSystem.js';

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

export class Conveyor extends ECSEntity {
    get id(): string {
        return 'conveyor';
    }
    inventory: InventorySlot;

    update() {}
}

export class ConveyorComponent extends ECSComponent {
    get id(): string {
        return 'conveyor';
    }
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
