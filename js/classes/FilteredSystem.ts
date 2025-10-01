import { ServiceLocator } from '@sorskoot/wonderland-components';
import { ECSComponent } from './ECS/ECSComponent.js';
import { ECSEntity } from './ECS/ECSEntity.js';
import { GlobalEvents } from './GlobalEvents.js';

export abstract class FilteredSystem<T extends ECSComponent> {
    private componentType: { new (...args: any[]): T };

    constructor(componentType: { new (...args: any[]): T }) {
        this.componentType = componentType;
        // Listen to entity events
        // It would be nice if we can filter these somehow.
        // Maybe in a base class?
        // Not sure how, I don't think `if T instance of U' will work.
        const globalEvents = ServiceLocator.get(GlobalEvents);
        globalEvents.EntityPlaced.on(this.addComponent, this);
        globalEvents.EntityRemoved.on(this.removeComponent, this);
    }

    private addComponent = (entity: ECSEntity) => {
        //console.log('Entity placed', entity);
        // How do we know what is placed?
        // Shapez uses a registry of meta buildings, and just gets the one from there.
        // There are singletons, based on 'string'.
        if (entity.hasComponent(this.componentType)) {
            this.componentAdded(entity);
        }
    };

    private removeComponent = (entity: ECSEntity) => {
        this.componentRemoved(entity);
    };

    abstract componentAdded(entity: ECSEntity): void;
    abstract componentRemoved(entity: ECSEntity): void;
}
