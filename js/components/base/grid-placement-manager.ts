import {
    Component,
    Object3D,
    Material,
    MeshComponent,
    ComponentConstructor,
} from '@wonderlandengine/api';
import { property } from '@wonderlandengine/api/decorators.js';
import { wlUtils, CellData } from '@sorskoot/wonderland-components';
import { quat } from 'gl-matrix';
import { Observable } from '@sorskoot/wonderland-components';

// Reused temp quat to avoid allocations when possible
const _tmpQuat = quat.create();

export interface PlaceableItem {
    id: string | number;
    prefabName: string;
}

export interface ItemMeta extends Component {
    getGridPositions(
        offset: [number, number],
        direction: any
    ): [number, number][];
    size: number[];
}

export interface PrefabManager {
    spawn(prefabName: string, parent?: Object3D): Object3D;
}

export abstract class GridPlacementManager<
    TItem extends PlaceableItem,
    TDirection = number
> extends Component {
    @property.object({ required: true })
    declare highlight: Object3D;

    @property.material({ required: true })
    declare highlightMaterial: Material;

    @property.object({ required: true })
    declare directionPointer: Object3D;

    protected _placedItemsMap: Map<string, Object3D> = new Map();
    protected _currentItemType: TItem | null = null;
    protected _previews: Map<TItem | string, Object3D> = new Map();
    protected _currentPreview: Object3D | null = null;
    protected _currentDirection: TDirection;

    protected _selectedBuilding: Observable<string> = new Observable<string>(
        ''
    );

    // Abstract methods that subclasses must implement
    protected abstract _getPrefabManager(): PrefabManager;
    protected abstract _getDefaultDirection(): TDirection;
    protected abstract _directionToAngle(direction: TDirection): number;
    protected abstract _rotateDirection(direction: TDirection): TDirection;
    protected abstract _getAvailableItems(): TItem[];
    protected abstract _getItemMetaComponent(): ComponentConstructor<ItemMeta>;

    // Optional hooks for subclasses
    protected _onItemSelected(item: TItem | null): void {}
    protected _onDirectionChanged(direction: TDirection): void {}
    protected _canPlaceItem(
        tile: CellData,
        tilemap: any,
        item: TItem
    ): boolean {
        return true;
    }
    protected _onItemPlaced(
        obj: Object3D,
        tile: CellData,
        tilemap: any
    ): void {}

    init() {
        this._currentDirection = this._getDefaultDirection();
    }

    start() {
        // Ensure visuals are hidden until needed
        try {
            this.highlight.setScalingLocal([0, 0, 0]);
        } catch (e) {
            // ignore if not set in editor
        }
        try {
            this.directionPointer.setScalingLocal([0, 0, 0]);
        } catch (e) {
            // ignore if not set in editor
        }
    }

    handleTileHover(tile: CellData | null, tilemap: any) {
        if (!tile) return;

        const pos = tilemap.tileToWorldPosition(tile);

        if (this._currentItemType !== null) {
            this._updatePreview(tile, tilemap);
        } else {
            this.highlight.setPositionWorld([pos.x, 0.5, pos.y]);
            this.highlight.setScalingLocal([1, 1, 1]);
        }
    }

    handleTileUnhover(_tile: CellData | null) {
        this.highlight.setScalingLocal([0, 0, 0]);
        this.directionPointer.setScalingLocal([0, 0, 0]);
        if (this._currentPreview) {
            this._currentPreview.setScalingLocal([0, 0, 0]);
            this._currentPreview = null;
        }
    }

    handleTileClick(tile: CellData | null, tilemap: any) {
        if (!tile) return;
        this._onItemPlaced(null, tile, tilemap);

        const pos = tilemap.tileToWorldPosition(tile);
        // if (this._currentItemType !== null) {
        //     // Check if placement is allowed
        //     if (!this._canPlaceItem(tile, tilemap, this._currentItemType)) {
        //         return;
        //     }

        //     let occupied = false;
        //     const metaComponent = this._getItemMetaComponent();
        //     const meta = this._currentPreview?.getComponent(metaComponent) as ItemMeta;
        //     if (meta) {
        //         const generatedPositions = meta.getGridPositions(
        //             [tile.x, tile.y],
        //             this._currentDirection
        //         );
        //         for (const [dx, dz] of generatedPositions) {
        //             const neighbor = tilemap.getTile(dx, dz);
        //             if (neighbor) {
        //                 occupied ||= this._placedItemsMap.has(neighbor.id);
        //             }
        //         }
        //     }

        //     if (occupied) {
        //         console.log('Tile already has an item');
        //         return;
        //     }

        //     const obj = this._getPrefabManager().spawn(this._currentItemType.prefabName, this.object);
        //     if (!obj) return;

        //     const dirAngle = this._directionToAngle(this._currentDirection);
        //     obj.setPositionWorld([pos.x, 0.5, pos.y]);
        //     obj.setRotationLocal(quat.fromEuler(_tmpQuat, 0, dirAngle, 0));

        //     const placedMeta = obj.getComponent(metaComponent) as ItemMeta;
        //     if (placedMeta) {
        //         const generatedPositions = placedMeta.getGridPositions(
        //             [tile.x, tile.y],
        //             this._currentDirection
        //         );
        //         for (const [dx, dz] of generatedPositions) {
        //             const neighbor = tilemap.getTile(dx, dz);
        //             if (neighbor) {
        //                 this._placedItemsMap.set(neighbor.id, obj);
        //                 if (neighbor.obj) {
        //                     neighbor.obj.destroy();
        //                 }
        //                 neighbor.obj = obj;
        //             }
        //         }
        //     }

        //     this._onItemPlaced(obj, tile, tilemap);
        // } else {
        //     // Selection mode - handle existing item selection
        //     if (this._placedItemsMap.has(tile.id)) {
        //         console.log(
        //             `Selecting ${
        //                 this._placedItemsMap.get(tile.id)?.name
        //             } on tile ${tile.id}`
        //         );
        //     } else {
        //         console.log(`Nothing on tile ${tile.id}`);
        //     }
        // }
    }

    protected _updatePreview(tile: CellData, tilemap: any) {}

    protected _setMaterialRecursively(preview: Object3D) {
        wlUtils
            .getComponentsOfTypeRecursive(preview, MeshComponent)
            .forEach((mesh) => {
                mesh.material = this.highlightMaterial;
            });
    }

    // Public API methods
    setItem(item: TItem | null) {
        this._currentItemType = item;
        this._onItemSelected(item);
    }

    rotateDirectionClockwise() {
        this._currentDirection = this._rotateDirection(this._currentDirection);
        this._onDirectionChanged(this._currentDirection);
    }

    getCurrentItem(): TItem | null {
        return this._currentItemType;
    }

    getCurrentDirection(): TDirection {
        return this._currentDirection;
    }
}
