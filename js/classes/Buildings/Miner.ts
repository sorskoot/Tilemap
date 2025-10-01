import { BuildingDescription } from '../BuildingDescription.js';
import { BuildingMeta } from '../BuildingMeta.js';
import { ECSEntity } from '../ECS/ECSEntity.js';
import { InventorySlot } from '../InventorySlot.js';

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

export class Miner extends ECSEntity {
    get id(): string {
        return 'miner';
    }
    output: InventorySlot;

    update() {}
}
