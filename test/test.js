/* eslint no-new: off */

// Require Third-party Dependencies
const avaTest = require("ava");
const is = require("@slimio/is");
const { setDriftlessTimeout } = require("driftless");

// Require Internal Dependencies
const CallbackScheduler = require("../index");

/**
 * @function sleep
 * @desc Sleep the async code execution by awaiting the timeOut
 * @param {!Number} [ms=1000] millisecond
 * @return {Promise<void>}
 */
function sleep(ms = 1000) {
    return new Promise((resolve) => setDriftlessTimeout(resolve, ms));
}

avaTest("CallbackScheduler - default static constructor options values", (test) => {
    test.is(CallbackScheduler.DefaultConstructorOptions.interval, 36000);
    test.false(CallbackScheduler.DefaultConstructorOptions.executeOnStart);
    test.is(CallbackScheduler.DefaultConstructorOptions.intervalUnitType, CallbackScheduler.Types.Seconds);
});

avaTest("CallbackScheduler - constructor.options.interval should be typeof <number>", (test) => {
    const error = test.throws(() => {
        new CallbackScheduler({ interval: "5" });
    }, TypeError);
    test.is(error.message, "CallbackScheduler.options.interval should be typeof <number>");
});

avaTest("CallbackScheduler - constructor.options.executeOnStart should be a <boolean>", (test) => {
    const error = test.throws(() => {
        new CallbackScheduler({ executeOnStart: 50 });
    }, TypeError);
    test.is(error.message, "CallbackScheduler.options.executeOnStart should be a <boolean>");
});

avaTest("CallbackScheduler - constructor.intervalUnitType should be typeof <string>", (test) => {
    const error = test.throws(() => {
        new CallbackScheduler({ intervalUnitType: 5 });
    }, TypeError);
    test.is(error.message, "CallbackScheduler.options.intervalUnitType should be typeof <string>");
});

avaTest("CallbackScheduler - default constructor values", (test) => {
    const Scheduler = new CallbackScheduler();
    test.is(Scheduler.interval, CallbackScheduler.DefaultConstructorOptions.interval);
    test.is(Scheduler.executeOnStart, CallbackScheduler.DefaultConstructorOptions.executeOnStart);
    test.false(Scheduler.started);
    test.true(is.number(Scheduler.startDate));
});

avaTest("CallbackScheduler - execute reset method", (test) => {
    const Scheduler = new CallbackScheduler();
    test.true(is.nullOrUndefined(Scheduler.timer));
    Scheduler.reset();
    test.false(is.nullOrUndefined(Scheduler.timer));
    test.true(is.number(Scheduler.timer));
});

avaTest("CallbackScheduler - execute walk method (first test)", async(test) => {
    const Scheduler = new CallbackScheduler({
        interval: 1
    });
    test.true(is.nullOrUndefined(Scheduler.timer));
    test.false(Scheduler.started);
    test.false(Scheduler.walk());
    test.true(Scheduler.started);

    const ret = Scheduler.walk();
    test.true(is.number(Scheduler.timer));
    test.false(ret);

    await sleep(500);
    test.false(Scheduler.walk());

    await sleep(500);
    test.true(Scheduler.walk());
});

avaTest("CallbackScheduler - execute walk method (second test)", async(test) => {
    const Scheduler = new CallbackScheduler({
        executeOnStart: true,
        interval: 2
    });
    test.true(is.nullOrUndefined(Scheduler.timer));
    test.false(Scheduler.started);
    test.true(Scheduler.walk());
    test.true(Scheduler.started);

    await sleep(1500);
    test.false(Scheduler.walk());

    await sleep(500);
    test.true(Scheduler.walk());
});

avaTest("CallbackScheduler - execute walk method with startDate", async(test) => {
    const startDate = new Date();
    startDate.setSeconds(startDate.getSeconds() + 3);
    const Scheduler = new CallbackScheduler({
        startDate,
        interval: 1
    });
    test.true(is.nullOrUndefined(Scheduler.timer));
    test.false(Scheduler.started);
    test.false(Scheduler.walk());
    test.true(Scheduler.started);

    await sleep(1000);
    test.false(Scheduler.walk());

    await sleep(3000);
    test.true(Scheduler.walk());
});

avaTest("CallbackScheduler - execute walk method in milliseconds", async(test) => {
    const Scheduler = new CallbackScheduler({
        executeOnStart: true,
        startDate: void 0,
        interval: 200,
        intervalUnitType: CallbackScheduler.Types.Milliseconds
    });

    // Check type error
    const typeError = test.throws(() => {
        Scheduler.type = "mdr";
    }, TypeError);
    test.is(typeError.message, "Unknown TYPE value mdr !");

    test.true(is.nullOrUndefined(Scheduler.timer));
    test.false(Scheduler.started);
    test.true(Scheduler.walk());
    test.true(Scheduler.started);

    await sleep(100);
    test.false(Scheduler.walk());

    await sleep(200);
    test.true(Scheduler.walk());
});
