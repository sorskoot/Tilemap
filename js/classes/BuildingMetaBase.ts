import { Object3D, NumberArray } from '@wonderlandengine/api';
import { BuildingDescription } from './BuildingDescription.js';
import { ECSEntity } from './ECS/ECSEntity.js';

// Metadata/description for buildings

export interface BuildingMetaBase {
    prefab: string;
    createEntity(
        obj: Object3D,
        position: Readonly<NumberArray>,
        rotation: Readonly<NumberArray>
    ): ECSEntity;
    getDimensions(variant: number): [number, number];
    getAllVariants(): BuildingDescription[];
}
