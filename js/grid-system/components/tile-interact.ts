import {
    Component,
    Emitter,
    Object3D,
    PhysXComponent,
    Shape,
    WonderlandEngine,
} from '@wonderlandengine/api';
import {
    Cursor,
    CursorTarget,
    FingerCursor,
} from '@wonderlandengine/components';
import { CellData, Tilemap } from '../classes/Tilemap.js';
import { GridSystemEvents } from '../classes/GridSystemEvents.js';

/** Reused temporary to avoid allocations in update handlers. */
const ownPos = new Float32Array(3);

/**
 * Component that exposes simple cursor-based interaction for a Tilemap.
 *
 * This component adds/uses a `CursorTarget` and a `PhysXComponent` (plane)
 * on the same object so that Wonderland's cursor system can raycast against
 * it. Cursor events are translated into tile coordinates for a provided
 * `Tilemap<CellData>` instance and emitted through `onClick`, `onHover`
 * and `onUnhover` emitters.
 */
export class TileInteract extends Component {
    static TypeName = 'tile-interact';

    /**
     * Ensure `CursorTarget` is registered with the engine. Called once when
     * the engine loads components.
     */
    static onRegister(engine: WonderlandEngine) {
        engine.registerComponent(CursorTarget);
    }

    /** CursorTarget instance used to receive cursor events. */
    private declare _cursorTarget: CursorTarget;
    private _map: Tilemap<CellData>;

    start() {
        if (!this.engine.physics) {
            console.error(
                'TileInteract: Physx not enabled in Wonderland Engine'
            );
        }
        this._cursorTarget =
            this.object.getComponent(CursorTarget) ??
            this.object.addComponent(CursorTarget);

        this.object.getComponent(PhysXComponent) ??
            this.object.addComponent(PhysXComponent, {
                shape: Shape.Plane,
                rotationOffset: [
                    0.0, 0.0, 0.7071068286895752, 0.7071068286895752,
                ],
                static: true,
            });
    }

    /**
     * When activated, subscribe to cursor click and move events.
     */
    onActivate(): void {
        GridSystemEvents.onMapLoaded.add(this._mapLoaded);
        this._cursorTarget.onClick.add(this._onClick);
        this._cursorTarget.onMove.add(this._onMove);
    }

    /**
     * When deactivated, unsubscribe to avoid duplicate listeners or leaks.
     */
    onDeactivate(): void {
        this._cursorTarget.onClick.remove(this._onClick);
        this._cursorTarget.onMove.remove(this._onMove);
    }

    private _mapLoaded = (map: Tilemap<CellData> | null) => {
        this._map = map;
    };
    /**
     * Convert a cursor hit position into map-relative tile coordinates.
     *
     * @param cursor - Cursor data from the cursor event.
     * @returns Object containing x and y in tile-space (can be fractional).
     */
    private _toRelativePos(cursor: Cursor): { x: number; y: number } {
        if (!this._map) {
            throw new Error('TileInteract: No map loaded');
        }
        const cursorHitPos = cursor.cursorPos;
        this.object.getPositionWorld(ownPos);
        return this._map.worldToTile(cursorHitPos[0], cursorHitPos[2]);
    }

    /**
     * Internal click handler that looks up the tile under the cursor and
     * notifies listeners via the `onClick` emitter.
     */
    private _onClick = (target: Object3D, cursor: Cursor | FingerCursor) => {
        if (!this._map) {
            console.warn('TileInteract: No map loaded');
            return;
        }
        if (!(cursor instanceof Cursor)) {
            console.warn(
                `TileInteract: Only Cursor type is supported, received ${cursor.constructor.name}`
            );
            return;
        }
        const relativePos = this._toRelativePos(cursor);
        const tile = this._map.getTile(relativePos.x, relativePos.y);
        GridSystemEvents.onMapClick.notify(tile);
    };

    /** The previously hovered tile (or null). Used to emit unhover events. */
    private _previousTile: CellData | null = null;

    /**
     * Internal move handler that emits `onHover` and `onUnhover` when the
     * hovered tile changes.
     */
    private _onMove = (target: Object3D, cursor: Cursor | FingerCursor) => {
        if (!this._map) {
            console.warn('TileInteract: No map loaded');
            return;
        }
        const relativePos = this._toRelativePos(cursor as Cursor);
        const tile = this._map.getTile(relativePos.x, relativePos.y);
        if (tile !== this._previousTile) {
            if (this._previousTile) {
                GridSystemEvents.onMapUnhover.notify(this._previousTile);
            }
            if (tile) {
                GridSystemEvents.onMapHover.notify(tile);
            }
            this._previousTile = tile;
        }
    };
}
