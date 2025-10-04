import {ECSComponent} from '../ECS/ECSComponent.js';
import {ECSEntity} from '../ECS/ECSEntity.js';

export class TransporterComponent extends ECSComponent {
    get id(): string {
        return 'transporter';
    }

    capacity: number = 1;

    contents: ECSEntity[] = [];
    inTransition: Map<ECSEntity, number> = new Map();
    // Entity being transported and time remaining in transition (ms)

    //TK is this correct? Or should it be a TransporterComponent?
    // Connecting to a TransporterComponent means the reference to the entity is lost
    // From the entity we can get the component
    next: ECSEntity | null = null;
    prev: ECSEntity | null = null;

    //TK maybe do it like this? This can be anything.
    connectedTo: ECSEntity | null = null;
}
