/**
 * CallbackScheduler class definition
 */
declare class CallbackScheduler {
    // Constructor
    constructor(options?: CallbackScheduler.ConstructorOptions);

    static Types: CallbackScheduler.AvailableTypes;

    // Properties
	public interval: number;
	public started: boolean;
	public hasBeenResetAfterStartDate: boolean;
	public executeOnStart: boolean;
	public timer: number;
    public startDate: number;
    public type: keyof AvailableTypes;

    // Static properties
    static DefaultConstructorOptions: CallbackScheduler.ConstructorOptions;

    // Methods
	public reset(): void;
	public walk(): boolean;
}

/**
 * CallbackScheduler namespace
 */
declare namespace CallbackScheduler {

    // Constructor interface
    interface ConstructorOptions {
		interval?: number;
		startDate?: date;
        executeOnStart?: boolean;
        intervalUnitType?: keyof AvailableTypes;
    }

    interface AvailableTypes {
        Milliseconds: "millisecond",
        Seconds: "second"
    }

}

export as namespace CallbackScheduler;
export = CallbackScheduler;
