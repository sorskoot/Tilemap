// Lets figure out a way to move an item from conveyor to conveyor around the world.

import {ECSEntity} from '../ECS/ECSEntity.js';
import {BuildingDescription} from '../BuildingDescription.js';
import {BuildingMeta} from '../BuildingMeta.js';
import {TransporterComponent} from '../Components/TransporterComponent.js';

// Conveyor building description
export class ConveyorMeta extends BuildingMeta {
    // We can extend this with different variations and such later.
    prefab: string = 'Belt'; // reference to 3D model

    getAllVariants(): BuildingDescription[] {
        return [{id: 1, name: 'Straight', prefab: this.prefab}];
    }

    protected onCreate(entity: ECSEntity): void {
        entity.addComponent(new TransporterComponent());
    }
}
