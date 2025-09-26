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

    getGridPositions(
        offset: [number, number],
        direction: Direction
    ): [number, number][] {
        const positions: [number, number][] = [];
        for (let x = 0; x < this.size[0]; x++) {
            for (let z = 0; z < this.size[2]; z++) {
                switch (direction) {
                    case Direction.North:
                        positions.push([offset[0] - x, offset[1] + z]);
                        break;
                    case Direction.East:
                        positions.push([offset[0] + z, offset[1] + x]);
                        break;
                    case Direction.South:
                        positions.push([offset[0] + x, offset[1] - z]);
                        break;
                    case Direction.West:
                        positions.push([offset[0] - z, offset[1] - x]);
                        break;
                }
            }
        }
        return positions;
    }
}
