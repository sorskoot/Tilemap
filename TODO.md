# Software Design Patterns for BuildingManager and MapManager Separation

## Current Architecture Analysis

The current codebase shows tight coupling between `BuildingManager` and the map/tilemap system:

1. **`GenerateMap`** - Handles the tilemap/grid system and tile events
2. **`BuildingManager`** - Extends `GridPlacementManager` and handles building placement logic
3. **Current Connection**: `GenerateMap` injects `BuildingManager` and delegates tile events (`onTileClick`, `onTileHover`, `onTileUnhover`) to it

## Recommended Design Patterns

### 1. Observer Pattern (Most Suitable)

This pattern is perfect for the event-driven architecture. The tilemap system can notify multiple observers about tile events without knowing who they are.

```typescript
export interface TileEvent {
    type: 'click' | 'hover' | 'unhover';
    tile: any; // Your tile type
    tilemap: any; // Your tilemap instance
    timestamp: number;
}

export interface TileEventObserver {
    onTileEvent(event: TileEvent): void;
}

export class TileEventSubject {
    private _observers: TileEventObserver[] = [];

    subscribe(observer: TileEventObserver): void {
        this._observers.push(observer);
    }

    unsubscribe(observer: TileEventObserver): void {
        const index = this._observers.indexOf(observer);
        if (index > -1) {
            this._observers.splice(index, 1);
        }
    }

    notify(event: TileEvent): void {
        for (const observer of this._observers) {
            observer.onTileEvent(event);
        }
    }
}
```

### 2. Event Bus/Mediator Pattern

A centralized event system that decouples components completely:

```typescript
export type EventHandler<T = any> = (data: T) => void;

export interface TileClickEvent {
    tile: any;
    tilemap: any;
    position: [number, number];
}

export interface TileHoverEvent {
    tile: any;
    tilemap: any;
    position: [number, number];
}

export class EventBus {
    private _events: Map<string, EventHandler[]> = new Map();

    on<T>(eventName: string, handler: EventHandler<T>): void {
        if (!this._events.has(eventName)) {
            this._events.set(eventName, []);
        }
        this._events.get(eventName)!.push(handler);
    }

    off<T>(eventName: string, handler: EventHandler<T>): void {
        const handlers = this._events.get(eventName);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }

    emit<T>(eventName: string, data: T): void {
        const handlers = this._events.get(eventName);
        if (handlers) {
            for (const handler of handlers) {
                handler(data);
            }
        }
    }
}
```

### 3. Strategy Pattern for Input Handling

Separate different interaction modes (building placement, selection, etc.):

```typescript
export interface TileInteractionStrategy {
    handleTileClick(tile: any, tilemap: any): void;
    handleTileHover(tile: any, tilemap: any): void;
    handleTileUnhover(tile: any): void;
    handleKeyDown(event: KeyboardEvent): void;
}

export class BuildingPlacementStrategy implements TileInteractionStrategy {
    constructor(private _buildingManager: BuildingManager) {}

    handleTileClick(tile: any, tilemap: any): void {
        this._buildingManager.handleTileClick(tile, tilemap);
    }

    handleTileHover(tile: any, tilemap: any): void {
        this._buildingManager.handleTileHover(tile, tilemap);
    }

    handleTileUnhover(tile: any): void {
        this._buildingManager.handleTileUnhover(tile);
    }

    handleKeyDown(event: KeyboardEvent): void {
        // Handle building-specific keyboard input
    }
}

export class SelectionStrategy implements TileInteractionStrategy {
    handleTileClick(tile: any, tilemap: any): void {
        // Handle selection logic
    }

    handleTileHover(tile: any, tilemap: any): void {
        // Handle selection hover
    }

    handleTileUnhover(tile: any): void {
        // Handle selection unhover
    }

    handleKeyDown(event: KeyboardEvent): void {
        // Handle selection-specific keyboard input
    }
}
```

## Recommended Implementation

For the specific case, use the **Observer Pattern** combined with **Service Locator** (already in use).

### Step 1: Create the Event System

```typescript
import { ServiceLocator } from '@sorskoot/wonderland-components';

export interface TileEvent {
    tile: any;
    tilemap: any;
    worldPosition: [number, number, number];
}

export interface TileEventHandler {
    onTileClick?(event: TileEvent): void;
    onTileHover?(event: TileEvent): void;
    onTileUnhover?(event: TileEvent): void;
}

@ServiceLocator.register
export class TileEventManager {
    private _handlers: TileEventHandler[] = [];

    register(handler: TileEventHandler): void {
        this._handlers.push(handler);
    }

    unregister(handler: TileEventHandler): void {
        const index = this._handlers.indexOf(handler);
        if (index > -1) {
            this._handlers.splice(index, 1);
        }
    }

    emitTileClick(event: TileEvent): void {
        for (const handler of this._handlers) {
            handler.onTileClick?.(event);
        }
    }

    emitTileHover(event: TileEvent): void {
        for (const handler of this._handlers) {
            handler.onTileHover?.(event);
        }
    }

    emitTileUnhover(event: TileEvent): void {
        for (const handler of this._handlers) {
            handler.onTileUnhover?.(event);
        }
    }
}
```

### Step 2: Update GenerateMap to Use Events

```typescript
// ...existing imports...
import { TileEventManager, TileEvent } from '../events/TileEvents.js';

export class GenerateMap extends GenerateMapBase<myCellData> {
    // ...existing properties...

    @ServiceLocator.inject(TileEventManager)
    private declare _tileEventManager: TileEventManager;

    // Remove the BuildingManager injection - no more direct coupling!

    override onTileClick(tile: myCellData) {
        const pos = this.tilemap.tileToWorldPosition(tile);
        const event: TileEvent = {
            tile,
            tilemap: this.tilemap,
            worldPosition: [pos.x, 0.5, pos.y]
        };
        this._tileEventManager.emitTileClick(event);
    }

    override onTileHover(tile: myCellData) {
        const pos = this.tilemap.tileToWorldPosition(tile);
        const event: TileEvent = {
            tile,
            tilemap: this.tilemap,
            worldPosition: [pos.x, 0.5, pos.y]
        };
        this._tileEventManager.emitTileHover(event);
    }

    override onTileUnhover(tile: myCellData) {
        const pos = this.tilemap.tileToWorldPosition(tile);
        const event: TileEvent = {
            tile,
            tilemap: this.tilemap,
            worldPosition: [pos.x, 0.5, pos.y]
        };
        this._tileEventManager.emitTileUnhover(event);
    }
}
```

### Step 3: Update BuildingManager to Subscribe to Events

```typescript
// ...existing imports...
import { TileEventManager, TileEventHandler, TileEvent } from '../events/TileEvents.js';

@ServiceLocator.registerComponent
export class BuildingManager extends GridPlacementManager<BuildingItem, Direction> implements TileEventHandler {
    // ...existing properties...

    @ServiceLocator.inject(TileEventManager)
    private declare _tileEventManager: TileEventManager;

    onActivate() {
        window.addEventListener('keydown', this._onKeyDown);
        this._tileEventManager.register(this);
    }

    onDeactivate() {
        window.removeEventListener('keydown', this._onKeyDown);
        this._tileEventManager.unregister(this);
    }

    // Implement TileEventHandler interface
    onTileClick(event: TileEvent): void {
        this.handleTileClick(event.tile, event.tilemap);
    }

    onTileHover(event: TileEvent): void {
        this.handleTileHover(event.tile, event.tilemap);
    }

    onTileUnhover(event: TileEvent): void {
        this.handleTileUnhover(event.tile);
    }

    // ...rest of existing methods...
}
```

## Benefits of This Approach

1. **Loose Coupling**: `GenerateMap` no longer needs to know about `BuildingManager`
2. **Extensibility**: Easily add new handlers (selection tools, terrain tools, etc.)
3. **Single Responsibility**: Each component focuses on its core purpose
4. **Testability**: Components can be tested in isolation
5. **Event-Driven**: Natural fit for UI/game interactions

## Implementation Tasks

- [ ] Create `TileEventManager` class in `js/events/TileEvents.ts`
- [ ] Define `TileEvent` and `TileEventHandler` interfaces
- [ ] Update `GenerateMap` to use `TileEventManager` instead of direct `BuildingManager` injection
- [ ] Update `BuildingManager` to implement `TileEventHandler` and register with event manager
- [ ] Remove direct coupling between `GenerateMap` and `BuildingManager`
- [ ] Test that tile interactions still work correctly
- [ ] Consider adding additional event handlers for future features (selection, terrain editing, etc.)

This Observer pattern approach is the most suitable for the event-driven tile interaction system and provides clean separation while maintaining flexibility for future expansion.