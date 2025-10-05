import {ServiceLocator} from '@sorskoot/wonderland-components';
import {Component, Object3D} from '@wonderlandengine/api';
import {GlobalSystemManager} from '../classes/GlobalSystemsManager.js';

export class SystemsManagerComponent extends Component {
    static TypeName = 'systems-manager-component';

    @ServiceLocator.inject(GlobalSystemManager)
    private declare _systemsManager: GlobalSystemManager;

    init() {}

    start() {
        this._systemsManager.registerSystems();
    }

    update(dt: number) {
        this._systemsManager.update(dt);
    }
}
