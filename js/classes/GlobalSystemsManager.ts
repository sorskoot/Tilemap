// Something like this?

import {ServiceLocator} from '@sorskoot/wonderland-components';
import {ConveyorSystem} from './Systems/ConveyorSystem.js';
import {MinerSystem} from './Systems/MinerSystem.js';
import {Timer} from './Timer.js';
import {ECSSystem} from './ECS/ECSSystem.js';
import {DebugSystem} from './Systems/DebugSystem.js';

// Maybe a base class.
@ServiceLocator.register
export class GlobalSystemManager {
    private systems: Map<string, ECSSystem> = new Map();
    private _timer: Timer;

    constructor() {
        this._timer = new Timer(5, performance.now() / 1000);
    }
    registerSystems() {
        this.systems.set('conveyor', new ConveyorSystem());
        this.systems.set('miner', new MinerSystem());
        //this.systems.set('debug', new DebugSystem());
    }

    update(dt: number) {
        const pt = this._timer.getTicks(dt);
        // just in case there's a huge lag spike, we don't want to update too many times
        // most of the time this will be 1 or 0. It will be updating at a
        // fixed timestep of 20 ticks per second.
        for (let i = 0; i < Math.min(10, pt); ++i) {
            this.systems.forEach((system) => {
                system.update(this._timer.fixedDelta);
            });
        }
    }
}
