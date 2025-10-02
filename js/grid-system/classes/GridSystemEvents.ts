import { Emitter } from '@wonderlandengine/api';
import { CellData, Tilemap } from './Tilemap.js';

class GridSystemEventChannels {
    onMapHover = new Emitter<[CellData | null]>();
    onMapUnhover = new Emitter<[CellData | null]>();
    onMapClick = new Emitter<[CellData | null]>();

    onMapLoaded = new Emitter<[Tilemap<CellData> | null]>();
}

const GridSystemEvents = new GridSystemEventChannels();

/**
 * Single instance of GridSystemEventChannels to be used throughout the app.
 */
export { GridSystemEvents };
