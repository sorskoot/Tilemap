import {
    CellData,
    ServiceLocator,
    Tilemap,
} from '@sorskoot/wonderland-components';
import { BuildingPrefabs } from './building-prefabs.js';
import { BuildingMeta } from './building-meta.js';
import {
    Direction,
    directionToAngle,
    rotateDirection,
} from '../classes/Direction.js';
import {
    GridPlacementManager,
    PlaceableItem,
    ItemMeta,
    PrefabManager,
} from './base/grid-placement-manager.js';
import { ComponentConstructor, Object3D } from '@wonderlandengine/api';
import { GlobalEvents } from '../classes/GlobalEvents.js';
import { getGridPositions } from '../classes/getGridPositions.js';
import { BuildingRegistry } from '../classes/BuildingRegistry.js';
import { myCellData } from './generate-map.js';
import { quat } from 'gl-matrix';

export enum BuildingState {
    none = 0,
    miner,
    processor,
    belt,
    storage,
}

export interface BuildingItem extends PlaceableItem {
    id: BuildingState;
    prefabName: string;
}

// Reused temp quat to avoid allocations when possible
const _tmpQuat = quat.create();

@ServiceLocator.registerComponent
export class BuildingManager extends GridPlacementManager<
    BuildingItem,
    Direction
> {
    static TypeName = 'building-manager';
    static InheritProperties = true;

    @ServiceLocator.inject(BuildingPrefabs)
    private declare _buildingPrefabs: BuildingPrefabs;

    @ServiceLocator.inject(GlobalEvents)
    private declare _globalEvents: GlobalEvents;

    @ServiceLocator.inject(BuildingRegistry)
    private declare _buildingRegistry: BuildingRegistry;

    // Keyboard handler is an arrow function so it can be removed safely
    private _onKeyDown = (e: KeyboardEvent) => {
        if (e.key === '0') {
            this.setItem(null);
            this._selectedBuilding.value = '';
        }
        if (e.key === '1') {
            this._selectedBuilding.value = 'miner';
        }
        if (e.key === '2') {
            this._selectedBuilding.value = 'processor';
        }
        if (e.key === '3') {
            this._selectedBuilding.value = 'conveyor';
        }
        if (e.key === '4') {
            this._selectedBuilding.value = 'storage';
        }
        if (e.key === 'r') {
            this.rotateDirectionClockwise();
        }
        this._updatePreview();
    };

    onActivate() {
        super.onActivate();
        this._selectedBuilding.subscribe(this.selectedBuildingChanged);
        window.addEventListener('keydown', this._onKeyDown);
    }

    onDeactivate() {
        super.onDeactivate();
        this._selectedBuilding.unsubscribe(this.selectedBuildingChanged);
        window.removeEventListener('keydown', this._onKeyDown);
    }

    selectedBuildingChanged = (newState) => {
        // update preview
    };

    // Implement abstract methods
    protected _getPrefabManager(): PrefabManager {
        return this._buildingPrefabs;
    }

    protected _getDefaultDirection(): Direction {
        return Direction.North;
    }

    protected _directionToAngle(direction: Direction): number {
        return directionToAngle(direction);
    }

    protected _rotateDirection(direction: Direction): Direction {
        return rotateDirection(direction, true);
    }

    protected _getItemMetaComponent(): ComponentConstructor<ItemMeta> {
        return BuildingMeta as any;
    }

    _canPlaceBuilding(size: [number, number], tile: myCellData) {
        let occupied = false;
        const generatedPositions = getGridPositions(
            size,
            [tile.x, tile.y],
            this._currentDirection
        );
        for (const [dx, dz] of generatedPositions) {
            const neighbor = this.tilemap.getTile(dx, dz);
            if (neighbor) {
                occupied ||= this._placedItemsMap.has(neighbor.id);
            }
        }
        return !occupied;
    }

    _placeBuilding(obj: Object3D, size: [number, number], tile: myCellData) {
        const generatedPositions = getGridPositions(
            size,
            [tile.x, tile.y],
            this._currentDirection
        );
        for (const [dx, dz] of generatedPositions) {
            const neighbor = this.tilemap.getTile(dx, dz);
            if (neighbor) {
                this._placedItemsMap.set(neighbor.id, obj);
                if (neighbor.obj) {
                    neighbor.obj.destroy();
                }
                neighbor.obj = obj;
            }
        }
    }

    protected _onItemPlaced(tile: myCellData): void {
        if (this._selectedBuilding.value !== '') {
            const b = this._buildingRegistry.get(this._selectedBuilding.value);
            if (b) {
                const [width, height] = b.getDimensions(0);

                if (!this._canPlaceBuilding([width, height], tile)) {
                    console.log("Can't place building here, space occupied");
                    return;
                }
                const obj = this._buildingPrefabs.spawn(b.prefab, this.object);
                this._placeBuilding(obj, [width, height], tile);
                const pos = this.tilemap.tileToWorldPosition(tile);
                b.createEntity(obj, [pos.x, 0.5, pos.y], [0, 0, 0]);
                obj.setPositionWorld([pos.x, 0.5, pos.y]);
                obj.setRotationLocal(
                    quat.fromEuler(
                        _tmpQuat,
                        0,
                        this._directionToAngle(this._currentDirection),
                        0
                    )
                );
            }
        }
        //this._globalEvents.EntityPlaced.emit(null);
    }

    protected _updatePreview(): void {
        if (this._selectedBuilding.value === '') return;
        if (!this._lastTile) return;
        const pos = this.tilemap.tileToWorldPosition(
            this._lastTile as myCellData
        );
        let preview: Object3D | undefined = this._previews.get(
            this._selectedBuilding.value
        );

        if (!preview) {
            const b = this._buildingRegistry.get(this._selectedBuilding.value);
            preview = this._getPrefabManager().spawn(b.prefab);
            this._setMaterialRecursively(preview);
            this._previews.set(this._selectedBuilding.value, preview);
        }

        if (this._currentPreview && this._currentPreview !== preview) {
            this._currentPreview.setScalingLocal([0, 0, 0]);
        }

        this._currentPreview = preview!;
        this._currentPreview.setPositionWorld([pos.x, 0.5, pos.y]);
        this._currentPreview.setRotationLocal(
            quat.fromEuler(
                _tmpQuat,
                0,
                this._directionToAngle(this._currentDirection),
                0
            )
        );
        this._currentPreview.setScalingLocal([1, 1, 1]);

        const metaComponent = this._getItemMetaComponent();
        const previewMeta = this._currentPreview.getComponent(
            metaComponent
        ) as ItemMeta;
        if (previewMeta) {
            this.directionPointer.setPositionWorld([
                pos.x,
                previewMeta.size[1],
                pos.y,
            ]);
            this.directionPointer.setScalingLocal([1, 1, 1]);
            this.directionPointer.setRotationLocal(
                quat.fromEuler(
                    _tmpQuat,
                    0,
                    this._directionToAngle(this._currentDirection),
                    0
                )
            );
        }
    }
}
