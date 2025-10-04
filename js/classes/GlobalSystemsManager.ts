// Something like this?

import {ServiceLocator} from '@sorskoot/wonderland-components';
import {ConveyorSystem} from './Systems/ConveyorSystem.js';
import {MinerSystem} from './Systems/MinerSystem.js';

// Maybe a base class.
@ServiceLocator.register
export class GlobalSystemManager {
    private systems: Map<string, any> = new Map();

    registerSystems() {
        this.systems.set('conveyor', new ConveyorSystem());
        this.systems.set('miner', new MinerSystem());
    }

    update() {
        this.systems.forEach((system) => {
            system.update();
        });
    }
}
