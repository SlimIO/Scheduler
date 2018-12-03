// CONSTANTS & SYMBOLS
const TYPE = Symbol("TYPE");
const AVAILABLE_TYPES = new Map([
    ["millisecond", 0],
    ["second", 1]
]);

/**
 * @class CallbackScheduler
 * @classdesc Used to schedule callback(s) execution in Addon
 *
 * @property {Number} interval
 * @property {Boolean} started
 * @property {Boolean} executeOnStart
 * @property {Boolean} hasBeenResetAfterStartDate
 * @property {Number} timer
 * @property {Number} startDate
 * @property {String} type
 *
 * @author GENTILHOMME Thomas
 */
class CallbackScheduler {
    /**
     * @constructor
     * @param {Object} [options={}] Scheduler Options
     * @param {Number} [options.interval=36000] Scheduler interval in second!
     * @param {Date} options.startDate Scheduler start date (default equal to now())
     * @param {Boolean} [options.executeOnStart=false] Enable walk on the first run
     * @param {String} [options.intervalUnitType="second"] Default Scheduler Type
     *
     * @throws {TypeError}
     *
     * @example
     * const Schedule = new Scheduler({
     *     interval: 1000
     * });
     */
    constructor(options = Object.create(null)) {
        const args = Object.assign(Object.create(CallbackScheduler.DefaultConstructorOptions), options);
        if (typeof args.interval !== "number") {
            throw new TypeError("CallbackScheduler.options.interval should be typeof <number>");
        }
        if (typeof args.executeOnStart !== "boolean") {
            throw new TypeError("CallbackScheduler.options.executeOnStart should be a <boolean>");
        }
        if (typeof args.intervalUnitType !== "string") {
            throw new TypeError("CallbackScheduler.options.intervalUnitType should be typeof <string>");
        }

        // Setup class properties
        this.interval = args.interval;
        if (args.startDate instanceof Date) {
            this.startDate = args.startDate.getTime();
            this.hasBeenResetAfterStartDate = false;
        }
        else {
            this.startDate = Date.now();
            this.hasBeenResetAfterStartDate = true;
        }
        this.executeOnStart = args.executeOnStart;
        this.started = false;
        this.timer = null;
        this.type = args.intervalUnitType;
    }

    /**
     * @public
     * @memberof CallbackScheduler#
     * @param {!String} value value
     * @return {void}
     */
    set type(value) {
        if (!AVAILABLE_TYPES.has(value)) {
            throw new TypeError(`Unknown TYPE value ${value} !`);
        }
        this[TYPE] = AVAILABLE_TYPES.get(value);
    }

    /**
     * @public
     * @method reset
     * @desc Reset scheduler to delta 0 (automatically called if walk match)
     * @memberof CallbackScheduler#
     * @returns {void}
     *
     * @version 0.0.0
     */
    reset() {
        const date = new Date();
        if (this[TYPE] === 0) {
            date.setMilliseconds(date.getMilliseconds() + this.interval);
        }
        else {
            date.setSeconds(date.getSeconds() + this.interval);
        }
        this.timer = date.getTime();
    }

    /**
     * @public
     * @method walk
     * @desc Increment the schedule (timer). It's what we call a 'walk'
     * @memberof CallbackScheduler#
     * @returns {Boolean}
     *
     * @version 0.0.0
     *
     * @example
     * const Schedule = new Scheduler({
     *     interval: 1
     * });
     *
     * setInterval(() => {
     *     if (!Schedule.walk()) {
     *         return;
     *     }
     *     console.log("One second elapsed!");
     * }, 100);
     */
    walk() {
        const now = Date.now();
        if (!this.started) {
            this.started = true;
            this.reset();

            return this.executeOnStart;
        }

        // Check if the time is elapsed (if not return false)
        if (this.startDate > now) {
            return false;
        }
        else if (!this.hasBeenResetAfterStartDate) {
            this.hasBeenResetAfterStartDate = true;
            this.reset();

            return true;
        }

        if (this.timer > now) {
            return false;
        }

        // Execute reset at the next iteration!
        setImmediate(() => {
            this.reset();
        });

        return true;
    }
}

/**
 * @static
 * @memberof CallbackScheduler#Types
 * @desc Available types
 * @property {Number} Milliseconds
 * @property {Number} Seconds
 */
CallbackScheduler.Types = {
    Milliseconds: "millisecond",
    Seconds: "second"
};

/**
 * @static
 * @memberof CallbackScheduler#DefaultConstructorOptions
 * @desc Default options for CallbackScheduler constructor
 * @property {Number} interval
 * @property {Date} startDate
 * @property {Boolean} executeOnStart
 * @property {String} defaultType
 */
CallbackScheduler.DefaultConstructorOptions = {
    interval: 36000,
    executeOnStart: false,
    intervalUnitType: CallbackScheduler.Types.Seconds
};

// Export class
module.exports = CallbackScheduler;
