/**
 * /!\ This file is auto-generated.
 *
 * This is the entry point of your standalone application.
 *
 * There are multiple tags used by the editor to inject code automatically:
 *     - `wle:auto-imports:start` and `wle:auto-imports:end`: The list of import statements
 *     - `wle:auto-register:start` and `wle:auto-register:end`: The list of component to register
 */

/* wle:auto-imports:start */
import {Cursor} from '@wonderlandengine/components';
import {MouseLookComponent} from '@wonderlandengine/components';
import {WasdControlsComponent} from '@wonderlandengine/components';
import {BuildingManager} from './components/building-manager.js';
import {BuildingMeta} from './components/building-meta.js';
import {BuildingPrefabs} from './components/building-prefabs.js';
import {GenerateMap} from './components/generate-map.js';
import {ItemRegistryComponent} from './components/item-registry-component.js';
import {ItemsPrefabs} from './components/items-prefabs.js';
import {SystemsManagerComponent} from './components/systems-manager-component.js';
import {MainHUD} from './ui/main-hud.tsx';
/* wle:auto-imports:end */


export default function (engine) {
    /* wle:auto-register:start */
engine.registerComponent(Cursor);
engine.registerComponent(MouseLookComponent);
engine.registerComponent(WasdControlsComponent);
engine.registerComponent(BuildingManager);
engine.registerComponent(BuildingMeta);
engine.registerComponent(BuildingPrefabs);
engine.registerComponent(GenerateMap);
engine.registerComponent(ItemRegistryComponent);
engine.registerComponent(ItemsPrefabs);
engine.registerComponent(SystemsManagerComponent);
engine.registerComponent(MainHUD);
/* wle:auto-register:end */

}
