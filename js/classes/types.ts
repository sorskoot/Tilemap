/**
 * Helper type to define constructor signatures
 */
export type Constructor<T = {}> = new (...args: any[]) => T;
export type Mixin = (base: Constructor) => Constructor;

/**
 * Compose multiple mixins in a clearer way instead of stacking them inline.
 *
 * Usage:
 *   const PipeBase = composeMixins(TransportBase, Tickable, MonitorNeighbors);
 *   export class Pipe extends PipeBase { ... }
 */
export function composeMixins<TBase extends Constructor>(
    base: TBase,
    ...mixins: Mixin[]
) {
    return mixins.reduce((current, mixin) => mixin(current), base);
}
