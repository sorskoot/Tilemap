import {TransporterComponent} from '../Components/TransporterComponent.js';
import {ECSSystem} from '../ECS/ECSSystem.js';
import {ECSWorld} from '../ECS/ECSWorld.js';

export class ConveyorSystem extends ECSSystem {
    // should this listen to the entity events?
    // And add/remove conveyors as components get added?
    constructor() {
        super('ConveyorSystem');
    }

    update(deltaTime: number): void {
        const transporters = ECSWorld.getEntitiesWithComponent(TransporterComponent);

        for (const entity of transporters) {
            const transporter = entity.getComponent(TransporterComponent);
            if (!transporter) {
                continue;
            }

            // Update items in transition
            for (const [item, timeRemaining] of transporter.inTransition) {
                const newTime = timeRemaining - deltaTime;
                if (newTime <= 0) {
                    // Transfer complete
                    transporter.inTransition.delete(item);
                    transporter.contents.push(item);

                    // Try to move to next transporter
                    if (transporter.next) {
                        const nextTransporter =
                            transporter.next.getComponent(TransporterComponent);
                        if (
                            nextTransporter &&
                            nextTransporter.contents.length < nextTransporter.capacity
                        ) {
                            // Move item to next transporter
                            const idx = transporter.contents.indexOf(item);
                            if (idx >= 0) {
                                transporter.contents.splice(idx, 1);
                                nextTransporter.inTransition.set(item, 1000); // 1 second transition
                            }
                        }
                    }
                } else {
                    transporter.inTransition.set(item, newTime);
                }
            }
        }
    }
}
