import {Direction} from '../Direction.js';
import {ECSComponent} from '../ECS/ECSComponent.js';
import {ECSEntity} from '../ECS/ECSEntity.js';
import {ItemDefinition} from '../ItemDefinition.js';

export class OutputSlotsComponent extends ECSComponent {
    get id(): string {
        return 'output_slots';
    }

    // items in the slot
    private _items: Map<number, ItemDefinition> = new Map();

    constructor(
        public slots: {
            pos: [number, number];
            direction: Direction;
        }[]
    ) {
        super();

        slots.forEach((_, index) => this._items.set(index, undefined));
    }

    getItems(slotIndex: number): ItemDefinition {
        return this._items.get(slotIndex);
    }

    addItem(slotIndex: number, item: ItemDefinition): boolean {
        const currentItem = this._items.get(slotIndex);

        if (!currentItem) {
            this._items.set(slotIndex, item);
            return true;
        }

        if (currentItem.id !== item.id) {
            // If there's already a different item, we can't add another
            return false;
        }

        if (!currentItem.stackable) {
            // if the item isn't stackable, we can't add another
            return false;
        }

        if (currentItem.currentInStack + item.currentInStack > item.maxStack) {
            // If adding the item would exceed max stack, we can't add it
            return false;
        }
        currentItem.currentInStack += item.currentInStack;
        this._items.set(slotIndex, currentItem);
        return true;
    }
}
