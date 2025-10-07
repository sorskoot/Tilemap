import {PrefabsBase, ServiceLocator} from '@sorskoot/wonderland-components';

@ServiceLocator.registerComponent
export class ItemsPrefabs extends PrefabsBase {
    static TypeName = 'items-prefabs';
    protected PrefabBinName(): string {
        return 'Items.bin';
    }
}
