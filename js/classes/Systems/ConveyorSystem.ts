import {ECSEntity} from '../ECS/ECSEntity.js';
import {ECSSystem} from '../ECS/ECSSystem.js';
import {FilteredSystem} from '../FilteredSystem.js';

export class ConveyorSystem extends ECSSystem {
    // should this listen to the entity events?
    // And add/remove conveyors as components get added?
    constructor() {
        super('ConveyorSystem');
    }

    update() {
        this.allEntities.forEach((conveyor) => {
            //conveyor.update();
        });
    }

    componentAdded(entity: ECSEntity): void {}
    componentRemoved(entity: ECSEntity): void {}
}
