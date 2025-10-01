import { ServiceLocator } from '@sorskoot/wonderland-components';
import { BuildingMetaBase } from './BuildingMetaBase.js';
import { ConveyorMeta } from './Buildings/Conveyor.js';
import { MinerMeta } from './Buildings/Miner.js';
import { ProcessorMeta } from './Buildings/Processor.js';

@ServiceLocator.register
export class BuildingRegistry {
    private items: Map<string, BuildingMetaBase> = new Map();

    register(name: string, item: BuildingMetaBase) {
        this.items.set(name, item);
    }

    get(name: string): BuildingMetaBase | undefined {
        return this.items.get(name);
    }
    constructor() {
        this.register('conveyor', new ConveyorMeta());
        this.register('miner', new MinerMeta());
        this.register('processor', new ProcessorMeta());
    }
}
