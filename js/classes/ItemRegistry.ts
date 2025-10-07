import {ServiceLocator} from '@sorskoot/wonderland-components';
import {ItemDefinition} from './ItemDefinition.js';

@ServiceLocator.register
export class ItemRegistry {
    private _defs: Map<string, ItemDefinition> = new Map();

    register(def: ItemDefinition): void {
        if (this._defs.has(def.id)) {
            throw new Error(`ItemRegistry: duplicate item id '${def.id}'`);
        }
        def.currentInStack = def.currentInStack || 1;
        this._defs.set(def.id, def);
    }

    get(id: string): ItemDefinition | undefined {
        // Rreturns a copy to prevent external mutation
        const def = this._defs.get(id);
        return def ? {...def} : undefined;
    }

    has(id: string): boolean {
        return this._defs.has(id);
    }

    all(): ItemDefinition[] {
        return Array.from(this._defs.values());
    }
}
