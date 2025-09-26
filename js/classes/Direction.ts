export enum Direction {
    North,
    East,
    South,
    West,
}

export const DirectionVectors: { [key in Direction]: [number, number] } = {
    [Direction.North]: [0, 1],
    [Direction.East]: [1, 0],
    [Direction.South]: [0, -1],
    [Direction.West]: [-1, 0],
};

export function rotateDirection(
    direction: Direction,
    clockwise: boolean = true
): Direction {
    const dirArray = Object.values(Direction).filter((e) => !isNaN(Number(e)));
    const currentIndex = dirArray.indexOf(direction);
    const newIndex = clockwise
        ? (currentIndex + 1) % dirArray.length
        : (currentIndex - 1 + dirArray.length) % dirArray.length;
    return dirArray[newIndex] as Direction;
}

export function directionToAngle(direction: Direction): number {
    switch (direction) {
        case Direction.North:
            return 0;
        case Direction.East:
            return 90;
        case Direction.South:
            return 180;
        case Direction.West:
            return 270;
    }
}
