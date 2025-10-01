import { Object3D, Property, property } from '@wonderlandengine/api';
import {
    GenerateMapBase,
    CellData,
    ServiceLocator,
} from '@sorskoot/wonderland-components';
import { BuildingManager } from './building-manager.js';

export type myCellData = CellData & {
    tileObjectId: number;
    obj: Object3D;
};

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

    @ServiceLocator.inject(BuildingManager)
    private declare _buildingManager: BuildingManager;

    start() {
        super.start();

        for (const tile of this.tilemap) {
            const id = Math.floor(Math.random() * this.tileObjects.length);
            const obj: Object3D = this.tileObjects[id].clone();
            obj.resetPositionRotation(); // reset position and rotation, but keep scale.
            //const p = this.tilemap.tileToWorldCenter(tile.x, tile.y);
            const p = this.tilemap.tileToWorldPosition(tile);
            obj.setPositionWorld([p.x, 0, p.y]);
            obj.parent = this.object;
            tile.tileObjectId = id;
            tile.obj = obj;
        }
        // highlight and direction visuals are owned by BuildingManager now
    }

    update(dt: number) {}

    override onTileClick(tile: myCellData) {
        // Delegate placement/click handling to BuildingManager
        this._buildingManager.handleTileClick(tile, this.tilemap);
    }

    override onTileHover(tile: myCellData) {
        this._buildingManager.handleTileHover(tile, this.tilemap);
    }

    override onTileUnhover(tile: myCellData) {
        this._buildingManager.handleTileUnhover(tile);
    }
}
