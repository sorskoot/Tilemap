import { ServiceLocator, EventChannel } from '@sorskoot/wonderland-components';
import { ECSEntity } from './ECS/ECSEntity.js';

@ServiceLocator.register
export class GlobalEvents {
    // What info do we need?
    EntityPlaced: EventChannel<[ECSEntity]> = new EventChannel();
    EntityRemoved: EventChannel<[ECSEntity]> = new EventChannel();

    // Thoughts on other events?
    // MapHover
}
