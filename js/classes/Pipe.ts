import { Tickable } from './mixins/Tickable.js';
import { TransportBase } from './MachineBase.js';
import { MonitorNeighbors } from './mixins/MonitorNeighbors.js';
import { composeMixins } from './types.js';
import { Direction } from './Direction.js';

export type Connection<T> = {
    direction: Direction;
    target: T;
};

export class Pipe extends TransportBase {
    // Pipe specific logic
    private _connectedTo: Map<Direction, Pipe> = new Map(); // Connections to other pipes
    capacity = 0;
    flowRate = 0; // items or whatever per tick

    get connectedTo(): Map<Direction, Pipe> {
        return this._connectedTo;
    }

    public tick(): void {}

    public neighborChanged(neighbor: any) {
        // Handle neighbor change
    }
}
