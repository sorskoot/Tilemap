import { ServiceLocator } from '@sorskoot/wonderland-components';
import { AtomSystem } from '@sorskoot/wonderland-components/atomECS';

@ServiceLocator.register
export class SystemManager {
    private _systems: AtomSystem[] = [];

    addSystem(system: AtomSystem) {
        this._systems.push(system);
    }

    update(dt: number) {
        for (const system of this._systems) {
            system.update(dt);
        }
    }
}
