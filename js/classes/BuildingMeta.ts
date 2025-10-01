import { Object3D, NumberArray } from '@wonderlandengine/api';
import { BuildingDescription } from './BuildingDescription.js';
import { BuildingMetaBase } from './BuildingMetaBase.js';
import { TransformComponent } from './TransformComponent.js';
import { ECSEntity } from './ECS/ECSEntity.js';

export abstract class BuildingMeta<T extends ECSEntity>
    implements BuildingMetaBase
{
    prefab: string;
    createEntity(
        obj: Object3D,
        position: Readonly<NumberArray>,
        rotation: Readonly<NumberArray>
    ): T {
        const entity = new ECSEntity() as T;
        entity.addComponent(new TransformComponent(obj, position, rotation));
        this.addComponents(entity);
        return entity;
    }

    getAllVariants(): BuildingDescription[] {
        throw new Error('Not implemented');
    }

    getDimensions(variant: number): [number, number] {
        return [1, 1];
    }

    protected abstract addComponents(entity: T): void;
}
