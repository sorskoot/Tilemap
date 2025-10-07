import {BuildingDescription} from '../BuildingDescription.js';
import {BuildingMeta} from '../BuildingMeta.js';
import {ECSEntity} from '../ECS/ECSEntity.js';

export class ProcessorMeta extends BuildingMeta {
    prefab: string = 'Processor'; // reference to 3D model

    getAllVariants(): BuildingDescription[] {
        return [{id: 1, name: 'default', prefab: this.prefab}];
    }
    getDimensions(variant: number): [number, number] {
        return [2, 1];
    }
    protected onCreate(entity: ECSEntity): void {}
}
