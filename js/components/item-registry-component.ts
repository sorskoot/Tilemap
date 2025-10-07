import {Component, Object3D, Property, Texture} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';
import {ItemDefinition} from '../classes/ItemDefinition.js';
import {ServiceLocator} from '@sorskoot/wonderland-components';
import {ItemRegistry} from '../classes/ItemRegistry.js';

class ItemRecord implements ItemDefinition {
    @property.string()
    id: string;

    @property.string()
    name: string;

    @property.bool()
    stackable: boolean;

    @property.int()
    maxStack?: number;

    @property.string()
    description?: string;

    @property.string()
    prefab?: string;

    @property.texture()
    icon?: Texture;
}

export class ItemRegistryComponent extends Component {
    static TypeName = 'item-registry-component';

    @property.array(Property.record(ItemRecord))
    items: ItemRecord[] = [];

    @ServiceLocator.inject(ItemRegistry)
    private declare _itemRegistry: ItemRegistry;

    start() {
        this.items.forEach((item) => this._itemRegistry.register(item));
    }
}
