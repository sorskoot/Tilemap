import {ECSComponent} from '../ECS/ECSComponent.js';

export class InventoryComponent extends ECSComponent {
    get id(): string {
        return 'inventory';
    }
}
