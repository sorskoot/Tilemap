import {
    Material,
    Mesh,
    MeshComponent,
    Object3D,
    Property,
    property,
} from '@wonderlandengine/api';
import {
    GenerateMapBase,
    CellData,
    ServiceLocator,
    wlUtils,
} from '@sorskoot/wonderland-components';
import { BuildingPrefabs } from './building-prefabs.js';
import { quat } from 'gl-matrix';
import { BuildingMeta } from './building-meta.js';
import {
    Direction,
    directionToAngle,
    rotateDirection,
} from '../classes/Direction.js';

type myCellData = CellData & {
    tileObjectId: number;
    obj: Object3D;
};

enum BuildingState {
    none = 0, // selection mode
    miner,
    processor,
    belt,
    storage,
}

/**
 * Example implementation
 */
export class GenerateMap extends GenerateMapBase<myCellData> {
    static TypeName = 'generate-map';
    static InheritProperties = true;
    /**
     * Array of Object3D references used as tile visuals or templates.
     *
     * Marked with @property.array so it is editable inside the editor.
     */
    @property.array(Property.object({ required: true }))
    declare tileObjects: Object3D[];

    @property.object({ required: true })
    declare highlight: Object3D;

    @property.material({ required: true })
    declare highlightMaterial: Material;

    @property.object({ required: true })
    declare directionPointer: Object3D;

    @ServiceLocator.inject(BuildingPrefabs)
    private declare _buildingPrefabs: BuildingPrefabs;

    private _buildingMap: Map<string, Object3D> = new Map();

    private _buildingState = BuildingState.miner;
    private _previews: Map<BuildingState, Object3D> = new Map();
    private _currentPreview: Object3D | null = null;
    private _currentDirection: Direction = Direction.North;

    start() {
        super.start();
        window.addEventListener('keydown', (e) => {
            if (e.key === '0') {
                this._buildingState = BuildingState.none;
            }
            if (e.key === '1') {
                this._buildingState = BuildingState.miner;
                if (this.currentHoveredTile) {
                    this._updatePreview(this.currentHoveredTile);
                }
            }
            if (e.key === '2') {
                this._buildingState = BuildingState.processor;
                if (this.currentHoveredTile) {
                    this._updatePreview(this.currentHoveredTile);
                }
            }
            if (e.key === '3') {
                this._buildingState = BuildingState.belt;
                if (this.currentHoveredTile) {
                    this._updatePreview(this.currentHoveredTile);
                }
            }
            if (e.key === '4') {
                this._buildingState = BuildingState.storage;
                if (this.currentHoveredTile) {
                    this._updatePreview(this.currentHoveredTile);
                }
            }
            if (e.key === 'r') {
                this._currentDirection = rotateDirection(
                    this._currentDirection
                );
                if (this.currentHoveredTile) {
                    this._updatePreview(this.currentHoveredTile);
                }
            }
        });
        for (const tile of this.tilemap) {
            const id = Math.floor(Math.random() * this.tileObjects.length);
            const obj = this.tileObjects[id].clone();
            obj.resetPositionRotation(); // reset position and rotation, but keep scale.
            //const p = this.tilemap.tileToWorldCenter(tile.x, tile.y);
            const p = this.tilemap.tileToWorldPosition(tile);
            obj.setPositionWorld([p.x, 0, p.y]);
            obj.parent = this.object;
            tile.tileObjectId = id;
            tile.obj = obj;
        }
        this.highlight.setScalingLocal([0, 0, 0]);
        this.directionPointer.setScalingLocal([0.0, 0.0, 0.0]);
    }

    update(dt: number) {}

    override onTileClick(tile: myCellData) {
        if (!tile) return; // Clicked outside the map
        const pos = this.tilemap.tileToWorldPosition(tile);
        if (this._buildingState !== BuildingState.none) {
            let occupied = false;
            // set occupied to true if the map has the tile
            //occupied ||= this._buildingMap.has(tile.id);
            const meta = this._currentPreview.getComponent(BuildingMeta);
            if (meta) {
                const generatedPositions = meta.getGridPositions(
                    [tile.x, tile.y],
                    this._currentDirection
                );

                for (const [dx, dz] of generatedPositions) {
                    const neighbor = this.tilemap.getTile(dx, dz);
                    if (neighbor) {
                        occupied ||= this._buildingMap.has(neighbor.id);
                    }
                }
            }

            if (occupied) {
                console.log('Tile already has a building');
                return; // Already a building here
            }
        }
        const dirAngle = directionToAngle(this._currentDirection);
        let meta: BuildingMeta | null;
        let obj: Object3D;
        switch (this._buildingState) {
            case BuildingState.none:
                if (this._buildingMap.has(tile.id)) {
                    console.log(
                        `Selecting ${
                            this._buildingMap.get(tile.id)?.name
                        } on tile ${tile.id}`
                    );
                } else {
                    console.log(`Nothing on tile ${tile.id}`);
                }
                break;
            case BuildingState.miner:
                obj = this._buildingPrefabs.spawn('Miner', this.object);

                break;
            case BuildingState.processor:
                obj = this._buildingPrefabs.spawn('Processor');

                break;
            case BuildingState.belt:
                obj = this._buildingPrefabs.spawn('Belt');
                break;
            case BuildingState.storage:
                obj = this._buildingPrefabs.spawn('Storage');
                break;
        }
        if (obj) {
            obj.setPositionWorld([pos.x, 0.5, pos.y]);
            obj.setRotationLocal(quat.fromEuler(quat.create(), 0, dirAngle, 0));
            meta = obj.getComponent(BuildingMeta);
            if (meta) {
                const generatedPositions = meta.getGridPositions(
                    [tile.x, tile.y],
                    this._currentDirection
                );

                for (const [dx, dz] of generatedPositions) {
                    const neighbor = this.tilemap.getTile(dx, dz);
                    if (neighbor) {
                        this._buildingMap.set(neighbor.id, obj);
                        neighbor.obj.destroy();
                        neighbor.obj = obj;
                    }
                }
            }
        }
    }
    private _updatePreview(tile: myCellData) {
        const pos = this.tilemap.tileToWorldPosition(tile);
        if (this._buildingState !== BuildingState.none) {
            let preview: Object3D;
            if (!this._previews.has(this._buildingState)) {
                let spawn = '';
                switch (this._buildingState) {
                    case BuildingState.miner:
                        spawn = 'Miner';
                        break;
                    case BuildingState.processor:
                        spawn = 'Processor';
                        break;
                    case BuildingState.belt:
                        spawn = 'Belt';
                        break;
                    case BuildingState.storage:
                        spawn = 'Storage';
                        break;
                }
                preview = this._buildingPrefabs.spawn(spawn);
                this._setMaterialRecursively(preview);
                this._previews.set(this._buildingState, preview);
            }
            if (
                this._currentPreview &&
                this._currentPreview !== this._previews.get(this._buildingState)
            ) {
                this._currentPreview.setScalingLocal([0, 0, 0]);
            }
            this._currentPreview = this._previews.get(this._buildingState);
            this._currentPreview.setPositionWorld([pos.x, 0.5, pos.y]);
            this._currentPreview.setRotationLocal(
                quat.fromEuler(
                    quat.create(),
                    0,
                    directionToAngle(this._currentDirection),
                    0
                )
            );
            this._currentPreview.setScalingLocal([1, 1, 1]);
            const previewMeta = this._currentPreview.getComponent(BuildingMeta);
            this.directionPointer.setPositionWorld([
                pos.x,
                previewMeta.size[1],
                pos.y,
            ]);
            this.directionPointer.setScalingLocal([1, 1, 1]);
            this.directionPointer.setRotationLocal(
                quat.fromEuler(
                    quat.create(),
                    0,
                    directionToAngle(this._currentDirection),
                    0
                )
            );
        } else {
            const pos = this.tilemap.tileToWorldPosition(tile);
            this.highlight.setPositionWorld([pos.x, 0.5, pos.y]);
            this.highlight.setScalingLocal([1, 1, 1]);
        }
    }
    private _setMaterialRecursively(preview: Object3D) {
        wlUtils
            .getComponentsOfTypeRecursive(preview, MeshComponent)
            .forEach((mesh) => {
                mesh.material = this.highlightMaterial;
            });
    }

    override onTileHover(tile: myCellData) {
        //  if (tile) {

        this._updatePreview(tile);
        //   }
        //this.highlight.setScalingLocal([0, 0, 0]);
        // console.log(`Tile hovered: ${tile.id}`);
        // tile.obj.translateLocal([0, 0.2, 0]);
        // this.tilemap.getNeighbors(tile.x, tile.y, false).forEach((t) => {
        //     t.obj.translateLocal([0, 0.05, 0]);
        // });
    }

    override onTileUnhover(tile: myCellData) {
        this.highlight.setScalingLocal([0, 0, 0]);
        this.directionPointer.setScalingLocal([0, 0, 0]);
        if (this._currentPreview) {
            this._currentPreview.setScalingLocal([0, 0, 0]);
            this._currentPreview = null;
        }
        // console.log(`Tile unhovered: ${tile.id}`);
        // tile.obj.translateLocal([0, -0.2, 0]);
        // this.tilemap.getNeighbors(tile.x, tile.y, false).forEach((t) => {
        //     t.obj.translateLocal([0, -0.05, 0]);
        // });
    }
}
