import {ProductionComponent} from '../Components/ProductionComponent.js';
import {ECSEntity} from '../ECS/ECSEntity.js';
import {ECSSystem} from '../ECS/ECSSystem.js';

export class MinerSystem extends ECSSystem {
    constructor() {
        super('MinerSystem');
    }

    update() {
        this.allEntities.forEach((miner) => {
            //miner.update();
        });
    }

    //TK: Should this listen for an event or something?
    componentAdded(entity: ECSEntity): void {
        const comp = entity.getComponent(ProductionComponent);
        if (!comp) {
            console.error('MinerSystem: Entity added without MinerComponent');
            return;
        }
        this.allEntities.push(entity);
    }
    componentRemoved(entity: ECSEntity): void {}
}
