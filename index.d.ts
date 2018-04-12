/**
 * CallbackScheduler class definition
 */
declare class CallbackScheduler {
    // Constructor
    constructor(options?: CallbackScheduler.ConstructorOptions);

    // Properties
	public interval: number;
	public started: boolean;
	public initialized: boolean;
	public executeOnStart: boolean;
	public timer: Date;
	public startDate: Date;


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
    }

}

export as namespace CallbackScheduler;
export = CallbackScheduler;
