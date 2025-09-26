import { PrefabsBase, ServiceLocator } from '@sorskoot/wonderland-components';

@ServiceLocator.registerComponent
export class BuildingPrefabs extends PrefabsBase {
    static TypeName = 'building-prefabs';
    protected PrefabBinName(): string {
        return 'buildings.bin';
    }
}
