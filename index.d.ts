declare class CallbackScheduler {
    constructor(options?: CallbackScheduler.ConstructorOptions);
    static isScheduler(obj: any): boolean;

    static dateAtHours(hours?: number, minutes?: number, seconds?: number): Date;

    // Properties
	public interval: number;
	public started: boolean;
	public hasBeenResetAfterStartDate: boolean;
	public executeOnStart: boolean;
	public timer: number;
    public startDate: number;
    public type: keyof CallbackScheduler.AvailableTypes;

    // Static properties
    static Types: CallbackScheduler.AvailableTypes;
    static DefaultConstructorOptions: CallbackScheduler.ConstructorOptions;

    // Methods
	public reset(): void;
	public walk(): boolean;
}

declare namespace CallbackScheduler {
    interface ConstructorOptions {
		interval?: number;
		startDate?: Date;
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
