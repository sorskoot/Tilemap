import {ECSComponent} from '../ECS/ECSComponent.js';

export class ProductionComponent extends ECSComponent {
    get id(): string {
        return 'production';
    }
}
