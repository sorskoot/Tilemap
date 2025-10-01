import { BuildingDescription } from '../BuildingDescription.js';
import { BuildingMeta } from '../BuildingMeta.js';
import { ECSEntity } from '../ECS/ECSEntity.js';
import { InventorySlot } from '../InventorySlot.js';

export class Processor extends ECSEntity {
    get id(): string {
        return 'processor';
    }
    input: InventorySlot;
    output: InventorySlot;

    update() {}
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
