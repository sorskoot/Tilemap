export class Timer {
    /**
     * Current fractional progress between ticks used for rendering.
     *
     * This accumulates fractional ticks and is reduced by the integer tick
     * amount when getPartialTicks is called.
     */
    public renderPartialTicks: number = 0;

    /**
     * The number of elapsed partial ticks computed in the last call.
     *
     * This represents the fractional tick delta computed from the provided
     * delta-time and the configured tick rate.
     */
    public elapsedPartialTicks: number = 0;

    /**
     * The fixed timestep length in seconds.
     */
    public get fixedDelta(): number {
        return this._tickLength;
    }

    private _lastSyncSysClock = 0;
    private _tickLength = 0;
    private _gameTime = 0;

    /**
     * Create a new Timer.
     *
     * @param ticks - Number of ticks per second. Used to compute tick length.
     * @param lastSyncSysClock - Initial game time reference (in same time units as dt).
     */
    constructor(ticks: number, lastSyncSysClock: number) {
        this._tickLength = 1.0 / ticks;
        this._lastSyncSysClock = lastSyncSysClock;
    }

    /**
     * Update the internal game time and compute how many full ticks have passed.
     *
     * This updates internal accumulators used for interpolation and returns the
     * integer number of full ticks that elapsed during the provided delta-time.
     *
     * @param dt - Delta time since the last update (in same units as lastSyncSysClock).
     * @returns The number of full ticks that have elapsed as an integer.
     */
    public getTicks(dt: number): number {
        this._gameTime += dt;
        this.elapsedPartialTicks =
            (this._gameTime - this._lastSyncSysClock) / this._tickLength;
        this._lastSyncSysClock = this._gameTime;
        this.renderPartialTicks += this.elapsedPartialTicks;
        const i = Math.floor(this.renderPartialTicks);
        this.renderPartialTicks -= i;
        return i;
    }
}
