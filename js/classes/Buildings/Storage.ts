import {BuildingDescription} from '../BuildingDescription.js';
import {BuildingMeta} from '../BuildingMeta.js';
import {InventoryComponent} from '../Components/InventoryComponent.js';
import {ECSEntity} from '../ECS/ECSEntity.js';
import {InventorySlot} from '../InventorySlot.js';

export class StorageMeta extends BuildingMeta {
    prefab: string = 'Storage'; // reference to 3D model

    getAllVariants(): BuildingDescription[] {
        return [{id: 1, name: 'default', prefab: this.prefab}];
    }

    protected onCreate(entity: ECSEntity): void {
        entity.addComponent(new InventoryComponent());
    }
}
