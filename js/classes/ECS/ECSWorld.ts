import {ECSEntity} from './ECSEntity.js';
import {ECSComponent} from './ECSComponent.js';

export class ECSWorld {
    private static _sessionId = Date.now().toString(36);
    private static _nextId = 1;

    private static _entities: Map<string, ECSEntity> = new Map();
    private static _componentRegistry: Map<string, Set<string>> = new Map();

    static createEntity(): ECSEntity {
        const id = `${this._sessionId}-${this._nextId++}`;
        const entity = new ECSEntity(id);
        this._entities.set(id, entity);
        return entity;
    }

    static deleteEntity(entityId: string) {
        // Remove from all component registries
        for (const entitySet of this._componentRegistry.values()) {
            entitySet.delete(entityId);
        }

        // Remove from entity map
        this._entities.delete(entityId);
    }

    /**
     * Register that an entity has a component
     * Called internally when a component is added to an entity
     */
    static registerComponent(entityId: string, componentId: string): void {
        if (!this._componentRegistry.has(componentId)) {
            this._componentRegistry.set(componentId, new Set());
        }
        this._componentRegistry.get(componentId)!.add(entityId);
    }

    /**
     * Unregister a component from an entity
     * Called internally when a component is removed from an entity
     */
    static unregisterComponent(entityId: string, componentId: string): void {
        const entitySet = this._componentRegistry.get(componentId);
        if (entitySet) {
            entitySet.delete(entityId);
        }
    }

    /**
     * Get all entities that have a specific component type
     * @param componentType - The component class to query for
     * @returns Array of entities with that component
     *
     * @example
     * ```typescript
     * const transporters = ECSWorld.getEntitiesWithComponent(TransporterComponent);
     * transporters.forEach(entity => {
     *     const transporter = entity.getComponent(TransporterComponent);
     *     // Process transporter logic
     * });
     * ```
     */
    static getEntitiesWithComponent<T extends ECSComponent>(componentType: {
        new (...args: any[]): T;
    }): ECSEntity[] {
        const results: ECSEntity[] = [];

        // Get component ID from a temporary instance
        const tempInstance = Object.create(componentType.prototype);
        const componentId = tempInstance.id;

        const entityIds = this._componentRegistry.get(componentId);
        if (entityIds) {
            for (const entityId of entityIds) {
                const entity = this._entities.get(entityId);
                if (entity) {
                    results.push(entity);
                }
            }
        }

        return results;
    }

    /**
     * Query entities with multiple component types
     * Returns only entities that have ALL specified components
     *
     * @example
     * ```typescript
     * const movers = ECSWorld.query([TransporterComponent, TransformComponent]);
     * movers.forEach(entity => {
     *     const transport = entity.getComponent(TransporterComponent);
     *     const transform = entity.getComponent(TransformComponent);
     *     // Process
     * });
     * ```
     */
    static query(componentTypes: Array<{new (...args: any[]): ECSComponent}>): ECSEntity[] {
        if (componentTypes.length === 0) {
            return [];
        }

        // Start with entities that have the first component
        let candidates = this.getEntitiesWithComponent(componentTypes[0]);

        // Filter by remaining components
        for (let i = 1; i < componentTypes.length; i++) {
            candidates = candidates.filter((entity) =>
                entity.hasComponent(componentTypes[i])
            );
        }

        return candidates;
    }

    /**
     * Get all entities
     */
    static getAllEntities(): ECSEntity[] {
        return Array.from(this._entities.values());
    }
}
