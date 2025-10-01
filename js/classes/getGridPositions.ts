import { Direction } from './Direction.js';

export function getGridPositions(
    size: [number, number],
    offset: [number, number],
    direction: Direction
): [number, number][] {
    const positions: [number, number][] = [];
    for (let x = 0; x < size[0]; x++) {
        for (let z = 0; z < size[1]; z++) {
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
