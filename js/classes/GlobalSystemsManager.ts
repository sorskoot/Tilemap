// Something like this?

import { ServiceLocator } from '@sorskoot/wonderland-components';
import { ConveyorSystem } from './conveyor.js';

// Maybe a base class.
@ServiceLocator.register
export class GlobalSystemManager {
    private systems: Map<string, any> = new Map();

    registerSystems() {
        this.systems.set('conveyor', new ConveyorSystem());
    }

    update() {
        this.systems.forEach((system) => {
            system.update();
        });
    }
}
