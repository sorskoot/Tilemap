import { ServiceLocator } from '@sorskoot/wonderland-components';
import { ECSEntity } from './ECS/ECSEntity.js';
import { Emitter } from '@wonderlandengine/api';

@ServiceLocator.register
export class GlobalEvents {
    // What info do we need?
    EntityPlaced: Emitter<[ECSEntity]> = new Emitter();
    EntityRemoved: Emitter<[ECSEntity]> = new Emitter();

    BuildingSelectionChanged: Emitter<[string | null]> = new Emitter();
}
