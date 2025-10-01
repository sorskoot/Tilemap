import { Object3D, NumberArray } from '@wonderlandengine/api';
import { ECSComponent } from './ECS/ECSComponent.js';

export class TransformComponent extends ECSComponent {
    get id(): string {
        return 'transform';
    }

    constructor(
        public obj: Object3D,
        public position: Readonly<NumberArray>,
        public rotation: Readonly<NumberArray>
    ) {
        super();
        // obj.setPositionWorld(position);
        // obj.setRotationWorld(rotation);
    }
}
