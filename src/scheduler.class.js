"use strict";

// CONSTANTS
const SchedulerSym = Symbol.for("Scheduler");
const TYPE = Symbol("TYPE");
const AVAILABLE_TYPES = new Map([
    ["millisecond", 0],
    ["second", 1]
]);

class CallbackScheduler {
    /**
     * @class CallbackScheduler
     * @memberof CallbackScheduler#
     * @param {object} [options={}] Scheduler Options
     * @param {number} [options.interval=36000] Scheduler interval in second!
     * @param {Date} options.startDate Scheduler start date (default equal to now())
     * @param {boolean} [options.executeOnStart=false] Enable walk on the first run
     * @param {string} [options.intervalUnitType="second"] Default Scheduler Type
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
        this[SchedulerSym] = true;
    }

    static isScheduler(obj) {
        return obj && Boolean(obj[SchedulerSym]);
    }

    /**
     * @function dateAtHours
     * @static
     * @description Create a Date object with hours, minutes, seconds option.
     *
     * @example
     * const a = Scheduler.dateAtHours(10, 1, 1);
     * console.log(a.toString()); //Will print your date with 10 hours, 1 minutes, 1 secondes, 0 milliseconds
     *
     * const b = Scheduler.dateAtHours(10);
     * console.log(b.toString()); //Will print your date with 10 hours, 0 minutes, 0 secondes, 0 milliseconds
     *
     * @param {number} hours The number of hours to set in the new date
     * @param {number} minutes The number of minutes to set in the new date
     * @param {number} seconds The number of seconds to set in the new date
     * @returns {Date} the new date with a good number of hours, minutes and seconds
     */
    static dateAtHours(hours = 0, minutes = 0, seconds = 0) {
        const date = new Date();
        date.setHours(hours, minutes, seconds, 0);

        return date;
    }

    /**
     * @public
     * @memberof CallbackScheduler#
     * @param {!string} value value
     * @returns {void}
     */
    set type(value) {
        if (!AVAILABLE_TYPES.has(value)) {
            throw new TypeError(`Unknown TYPE value ${value} !`);
        }
        this[TYPE] = AVAILABLE_TYPES.get(value);
    }

    /**
     * @public
     * @function reset
     * @description Reset scheduler to delta 0 (automatically called if walk match)
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
     * @function walk
     * @description Increment the schedule (timer). It's what we call a 'walk'
     * @memberof CallbackScheduler#
     * @returns {boolean}
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
 * @description Available types
 * @property {number} Milliseconds
 * @property {number} Seconds
 */
CallbackScheduler.Types = {
    Milliseconds: "millisecond",
    Seconds: "second"
};

/**
 * @static
 * @memberof CallbackScheduler#DefaultConstructorOptions
 * @description Default options for CallbackScheduler constructor
 * @property {number} interval
 * @property {Date} startDate
 * @property {boolean} executeOnStart
 * @property {string} defaultType
 */
CallbackScheduler.DefaultConstructorOptions = {
    interval: 36000,
    executeOnStart: false,
    intervalUnitType: CallbackScheduler.Types.Seconds
};

// Export class
module.exports = CallbackScheduler;
