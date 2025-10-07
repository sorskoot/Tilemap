import {ServiceLocator} from '@sorskoot/wonderland-components';
import {OutputSlotsComponent} from '../Components/OutputSlotComponent.js';
import {ProductionComponent} from '../Components/ProductionComponent.js';
import {ECSEntity} from '../ECS/ECSEntity.js';
import {ECSSystem} from '../ECS/ECSSystem.js';
import {ECSWorld} from '../ECS/ECSWorld.js';
import {ItemRegistry} from '../ItemRegistry.js';

export class MinerSystem extends ECSSystem {
    private _productionProgress: Map<ECSEntity, number> = new Map();

    @ServiceLocator.inject(ItemRegistry)
    private declare _itemRegistry: ItemRegistry;

    constructor() {
        super('MinerSystem');
    }

    update(fixedDelta: number): void {
        const producers = ECSWorld.getEntitiesWithComponent(ProductionComponent);

        for (const entity of producers) {
            const producer = entity.getComponent(ProductionComponent);

            if (!producer) {
                continue;
            }

            // Get current progress or initialize to 0
            const currentProgress = this._productionProgress.get(entity) || 0;

            // Add time based on production rate (time to produce 1 unit)
            const timeToProduceOne = 1.0 / producer.productionRate;
            const newProgress = currentProgress + fixedDelta;

            // Check if we've completed production
            if (newProgress >= timeToProduceOne) {
                // Production complete!
                // Add item to inventory or output slot?
                const outputSlots = entity.getComponent(OutputSlotsComponent);
                const prototype = this._itemRegistry.get('CopperNugget');
                if (!outputSlots.addItem(0, prototype)) {
                    // failed to add item, probably full.
                    // How to handle?
                    // Idealy the miner should wait until there's space.
                    // keep at full progress (This does mean it would try again every tick)
                    this._productionProgress.set(entity, timeToProduceOne);
                } else {
                    // Reset progress, keeping any overflow
                    this._productionProgress.set(entity, newProgress - timeToProduceOne);
                }
            } else {
                // Still producing, update progress
                this._productionProgress.set(entity, newProgress);
            }
        }

        // Clean up progress for entities that no longer have ProductionComponent
        this._cleanupDestroyedEntities(producers);
    }

    private _cleanupDestroyedEntities(activeProducers: ECSEntity[]): void {
        const activeSet = new Set(activeProducers);
        for (const entity of this._productionProgress.keys()) {
            if (!activeSet.has(entity)) {
                this._productionProgress.delete(entity);
            }
        }
    }
}
