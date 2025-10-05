import {ProductionComponent} from '../Components/ProductionComponent.js';
import {ECSEntity} from '../ECS/ECSEntity.js';
import {ECSSystem} from '../ECS/ECSSystem.js';

export class DebugSystem extends ECSSystem {
    constructor() {
        super('DebugSystem');
    }

    update(dt: number) {
        console.log(`DebugSystem Update: ${dt}`);
    }
}
