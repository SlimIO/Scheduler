// Require Third-party dependencies
const is = require("@sindresorhus/is");
const cloneDeep = require("lodash.clonedeep");

/**
 * @class CallbackScheduler
 * @classdesc Used to schedule callback(s) execution in Addon
 *
 * @property {Number} interval
 * @property {Boolean} started
 * @property {Boolean} initialized
 * @property {Boolean} executeOnStart
 * @property {Date} timer
 * @property {Date} startDate
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
     *
     * @throws {TypeError}
     *
     * @example
     * const Schedule = new Scheduler({
     *     interval: 1000
     * });
     */
    constructor(options = CallbackScheduler.DefaultConstructorOptions) {
        const args = Object.assign(cloneDeep(CallbackScheduler.DefaultConstructorOptions), options);
        if (!is.number(args.interval)) {
            throw new TypeError("CallbackScheduler.options.interval should be typeof <number>");
        }
        if (!is.date(args.startDate)) {
            throw new TypeError("CallbackScheduler.options.startDate should be a <Date> Object");
        }
        if (!is.boolean(args.executeOnStart)) {
            throw new TypeError("CallbackScheduler.options.executeOnStart should be a <boolean>");
        }

        // Setup class properties
        this.interval = args.interval;
        this.startDate = args.startDate;
        this.executeOnStart = args.executeOnStart;
        this.started = false;
        this.initialized = false;
        this.timer = null;
    }

    /**
     * @public
     * @method reset
     * @desc Reset scheduler to delta 0 (automatically called if walk match)
     * @memberof CallbackScheduler#
     * @returns {Boolean}
     *
     * @version 0.0.0
     */
    reset() {
        this.timer = new Date();
        this.timer.setSeconds(this.timer.getSeconds() + this.interval);

        return true;
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
        if (this.started === false) {
            this.started = true;

            return this.executeOnStart;
        }

        // Initialize timer!
        if (this.initialized === false) {
            this.initialized = true;
            this.reset();
        }

        // Check if the time is elapsed (if not return false)
        const now = new Date();
        if (this.startDate > now || this.timer > now) {
            return false;
        }

        // Return reset Scheduler (true)
        return this.reset();
    }

}

/**
 * @static
 * @memberof CallbackScheduler#DefaultConstructorOptions
 * @desc Default options for CallbackScheduler constructor
 * @property {Number} interval
 * @property {Date} startDate
 * @property {Boolean} executeOnStart
 */
CallbackScheduler.DefaultConstructorOptions = {
    interval: 36000,
    startDate: (function defaultDate() {
        const date = new Date();
        date.setHours(0, 0, 0, 0);

        return date;
    })(),
    executeOnStart: false
};

// Export class
module.exports = CallbackScheduler;
