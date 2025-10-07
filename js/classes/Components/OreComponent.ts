import {ECSComponent} from '../ECS/ECSComponent.js';

export class OreComponent extends ECSComponent {
    get id(): string {
        return 'ore';
    }

    type: string;

    constructor(type: string) {
        super();
        this.type = type;
    }
}
