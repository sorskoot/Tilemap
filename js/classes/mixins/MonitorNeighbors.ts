import { Constructor } from '../types.js';

export interface MonitorNeighbors {
    monitorNeighbors(): void;
    neighborChanged?: (neighbor: any) => void;
}
export function MonitorNeighbors<TBase extends Constructor>(
    Base: TBase
): TBase & Constructor<MonitorNeighbors> {
    return class extends Base implements MonitorNeighbors {
        monitorNeighbors(): void {}
        neighborChanged?(neighbor: any): void {}
    };
}
export function isMonitorNeighbors(obj: any): obj is MonitorNeighbors {
    return (
        'monitorNeighbors' in obj &&
        typeof obj.monitorNeighbors === 'function' &&
        'neighborChanged' in obj
    );
}
