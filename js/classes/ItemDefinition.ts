import {Texture} from '@wonderlandengine/api';

export interface ItemDefinition {
    id: string; // stable id, e.g. 'iron-ore'
    name: string;
    stackable: boolean;
    maxStack?: number; // if stackable, 0 or undefined means unlimited
    description?: string;
    prefab?: string; // reference to 3d model
    icon?: Texture; // reference to icon texture
    currentInStack?: number; // current number in stack
    // any extra metadata (tags, categories)
    // tags?: string[];
}
