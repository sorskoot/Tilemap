import { ServiceLocator } from '@sorskoot/wonderland-components';
import { CellData, Tilemap } from '../grid-system/index.js';

@ServiceLocator.register
export class MapRegistry {
    private tilemap: Tilemap<CellData> | null = null;

    createMap<T extends CellData>(
        tileSize: number[],
        offset: number[],
        dimensions: number[]
    ) {
        this.tilemap = new Tilemap<T>();
        this.tilemap.setTileSize(tileSize[0], tileSize[1]);
        this.tilemap.setOffset(offset[0], offset[1]);
        this.tilemap.createMap(dimensions[0], dimensions[1]);
        return this.tilemap;
    }

    getMap<T extends CellData>(): Tilemap<T> {
        return this.tilemap as Tilemap<T>;
    }
}
