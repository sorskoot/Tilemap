import { BuildingDescription } from '../BuildingDescription.js';
import { BuildingMeta } from '../BuildingMeta.js';
import { ECSEntity } from '../ECS/ECSEntity.js';
import { InventorySlot } from '../InventorySlot.js';

export class Storage extends ECSEntity {
    get id(): string {
        return 'storage';
    }
    inventory: InventorySlot;
    update() {}
}

export class StorageMeta extends BuildingMeta<Storage> {
    prefab: string = 'Storage'; // reference to 3D model

    getAllVariants(): BuildingDescription[] {
        return [{ id: 1, name: 'default', prefab: this.prefab }];
    }

    protected addComponents(entity: Storage): void {}
}
