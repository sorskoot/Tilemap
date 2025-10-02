import {
    Component,
    Object3D,
    Material,
    MeshComponent,
    ComponentConstructor,
} from '@wonderlandengine/api';
import { property } from '@wonderlandengine/api/decorators.js';
import { ServiceLocator, wlUtils } from '@sorskoot/wonderland-components';
import { quat } from 'gl-matrix';
import { Observable } from '@sorskoot/wonderland-components';
import { CellData } from '../../grid-system/index.js';
import { MapRegistry } from '../../classes/MapRegistry.js';
import { myCellData } from '../generate-map.js';
import { GridSystemEvents } from '../../grid-system/classes/GridSystemEvents.js';

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
    protected _previews: Map<string, Object3D> = new Map();
    protected _currentPreview: Object3D | null = null;
    protected _currentDirection: TDirection;

    protected _selectedBuilding: Observable<string> = new Observable<string>(
        ''
    );
    protected _lastTile: CellData | null = null;

    // Abstract methods that subclasses must implement
    protected abstract _getPrefabManager(): PrefabManager;
    protected abstract _getDefaultDirection(): TDirection;
    protected abstract _directionToAngle(direction: TDirection): number;
    protected abstract _rotateDirection(direction: TDirection): TDirection;

    // Optional hooks for subclasses
    protected _onItemSelected(item: TItem | null): void {}
    protected _onDirectionChanged(direction: TDirection): void {}
    protected _canPlaceItem(tile: CellData, item: TItem): boolean {
        return true;
    }
    protected _onItemPlaced(tile: CellData): void {}

    @ServiceLocator.inject(MapRegistry)
    protected declare _mapRegistry: MapRegistry;

    protected get tilemap() {
        return this._mapRegistry.getMap<myCellData>();
    }

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

    onActivate(): void {
        GridSystemEvents.onMapClick.add(this.handleTileClick);
        GridSystemEvents.onMapHover.add(this.handleTileHover);
        GridSystemEvents.onMapUnhover.add(this.handleTileUnhover);
    }

    onDeactivate(): void {
        GridSystemEvents.onMapClick.remove(this.handleTileClick);
        GridSystemEvents.onMapHover.remove(this.handleTileHover);
        GridSystemEvents.onMapUnhover.remove(this.handleTileUnhover);
    }

    handleTileHover = (tile: myCellData | null) => {
        if (!tile) return;
        this._lastTile = tile;

        const pos = this.tilemap.tileToWorldPosition(tile);

        if (this._selectedBuilding.value !== '') {
            this._updatePreview(tile);
        } else {
            this.highlight.setPositionWorld([pos.x, 0.5, pos.y]);
            this.highlight.setScalingLocal([1, 1, 1]);
        }
    };

    handleTileUnhover = (_tile: CellData | null) => {
        this.highlight.setScalingLocal([0, 0, 0]);
        this.directionPointer.setScalingLocal([0, 0, 0]);
        if (this._currentPreview) {
            this._currentPreview.setScalingLocal([0, 0, 0]);
            this._currentPreview = null;
        }
    };

    handleTileClick = (tile: myCellData | null) => {
        if (!tile) return;
        this._onItemPlaced(tile);
    };

    protected _updatePreview(tile: myCellData) {}

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
