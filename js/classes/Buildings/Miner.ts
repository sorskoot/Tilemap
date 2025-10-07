import {BuildingDescription} from '../BuildingDescription.js';
import {BuildingMeta} from '../BuildingMeta.js';
import {OutputSlotsComponent} from '../Components/OutputSlotComponent.js';
import {ProductionComponent} from '../Components/ProductionComponent.js';
import {Direction} from '../Direction.js';
import {ECSEntity} from '../ECS/ECSEntity.js';

export class MinerMeta extends BuildingMeta {
    // We can extend this with different variations and such later.
    prefab: string = 'Miner'; // reference to 3D model

    getAllVariants(): BuildingDescription[] {
        return [{id: 1, name: 'default', prefab: this.prefab}];
    }
    getDimensions(variant: number): [number, number] {
        return [2, 2];
    }

    protected onCreate(entity: ECSEntity): void {
        entity.addComponent(new ProductionComponent(1.0, `ore`));
        entity.addComponent(
            new OutputSlotsComponent([
                {pos: [0, 1], direction: Direction.North, capacity: 5},
            ])
        );
    }
}
