import {Emitter} from '@wonderlandengine/api';
import {ECSEntity} from './ECSEntity.js';

export class ECSWorld {
    private static _sessionId = Date.now().toString(36);
    private static _nextId = 1;
    private static _entities: Map<string, ECSEntity> = new Map();

    static createEntity(): ECSEntity {
        const id = `${this._sessionId}-${this._nextId++}`;
        const entity = new ECSEntity(id);
        this._entities.set(id, entity);
        return entity;
    }

    static deleteEntity(entityId: string) {
        // Remove from entity map
        this._entities.delete(entityId);
    }
}
