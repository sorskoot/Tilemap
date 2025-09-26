import { Constructor } from '../types.js';

export const TICKABLE = Symbol('Tickable');

export interface Tickable {
    [TICKABLE]: boolean;
    tick(): void;
}
export function Tickable<TBase extends Constructor>(
    Base: TBase
): TBase & Constructor<Tickable> {
    return class extends Base implements Tickable {
        [TICKABLE] = true;
        tick(): void {}
    };
}
export function isTickable(obj: any): obj is Tickable {
    return TICKABLE in obj && obj[TICKABLE] === true && 'tick' in obj;
}
