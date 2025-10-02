import { Object3D, Property, property } from '@wonderlandengine/api';
import { ServiceLocator } from '@sorskoot/wonderland-components';
import { BuildingManager } from './building-manager.js';
import { CellData, GenerateMapBase } from '../grid-system/index.js';
import { MapRegistry } from '../classes/MapRegistry.js';

export type myCellData = CellData & {
    tileObjectId: number;
    obj: Object3D;
};

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

    start() {
        super.start();
        const tilemap = ServiceLocator.get(MapRegistry).getMap<myCellData>();
        for (const tile of tilemap) {
            const id = Math.floor(Math.random() * this.tileObjects.length);
            const obj: Object3D = this.tileObjects[id].clone();
            obj.resetPositionRotation(); // reset position and rotation, but keep scale.
            //const p = this.tilemap.tileToWorldCenter(tile.x, tile.y);
            const p = tilemap.tileToWorldPosition(tile);
            obj.setPositionWorld([p.x, 0, p.y]);
            obj.parent = this.object;
            tile.tileObjectId = id;
            tile.obj = obj;
        }
        // highlight and direction visuals are owned by BuildingManager now
    }
}
