import {Object3D, NumberArray} from '@wonderlandengine/api';
import {BuildingDescription} from './BuildingDescription.js';
import {BuildingMetaBase} from './BuildingMetaBase.js';
import {TransformComponent} from './TransformComponent.js';
import {ECSEntity} from './ECS/ECSEntity.js';
import {ECSWorld} from './ECS/ECSWorld.js';

export abstract class BuildingMeta implements BuildingMetaBase {
    prefab: string;
    createEntity(
        obj: Object3D,
        position: Readonly<NumberArray>,
        rotation: Readonly<NumberArray>
    ): ECSEntity {
        const entity = ECSWorld.createEntity();
        entity.addComponent(new TransformComponent(obj, position, rotation));
        this.onCreate(entity);
        return entity;
    }

    getAllVariants(): BuildingDescription[] {
        throw new Error('Not implemented');
    }

    getDimensions(variant: number): [number, number] {
        return [1, 1];
    }

    /**
     * Called when an entity is created from this building meta.
     * @param entity the entity that was just created
     */
    protected abstract onCreate(entity: ECSEntity): void;
}
