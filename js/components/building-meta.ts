import { Component, Property } from '@wonderlandengine/api';
import { property } from '@wonderlandengine/api/decorators.js';
import { Direction } from '../classes/Direction.js';

export class BuildingMeta extends Component {
    static TypeName = 'building-meta';

    /**
     * Size of the building in tiles (x, y, z)
     * Also used for the highlight
     */
    @property.vector3(1, 1, 1)
    size = [1, 1, 1];

    @property.array(Property.vector3())
    connections: [number, number, number][] = [];
}
