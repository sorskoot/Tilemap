import {ECSComponent} from '../ECS/ECSComponent.js';

export class ProductionComponent extends ECSComponent {
    get id(): string {
        return 'production';
    }

    productionRate: number; // units per second
    resourceType: string;

    constructor(productionRate: number, resourceType: string) {
        super();
        this.productionRate = productionRate;
        this.resourceType = resourceType;
    }
}
