/* eslint no-new: off */

// Require dependencies
const avaTest = require("ava");
const is = require("@sindresorhus/is");
const CallbackScheduler = require("../index");

/**
 * Test CallbackScheduler static default constructor options
 */
avaTest("CallbackScheduler - default static constructor options values", (test) => {
    test.is(CallbackScheduler.DefaultConstructorOptions.interval, 36000);
    test.is(is.date(CallbackScheduler.DefaultConstructorOptions.startDate), true);
    test.is(CallbackScheduler.DefaultConstructorOptions.executeOnStart, false);
});

/**
 * Test CallbackScheduler - constructor options type (and error that throw)
 */
avaTest("CallbackScheduler - constructor throw", (test) => {

    // Test interval argument
    const intervalError = test.throws(() => {
        new CallbackScheduler({
            interval: "5"
        });
    }, TypeError);
    test.is(intervalError.message, "CallbackScheduler.options.interval should be typeof <number>");

    // Test startDate argument
    const dateError = test.throws(() => {
        new CallbackScheduler({
            startDate: 500
        });
    }, TypeError);
    test.is(dateError.message, "CallbackScheduler.options.startDate should be a <Date> Object");

    // Test executeOnStart argument
    const executeOnStartError = test.throws(() => {
        new CallbackScheduler({
            executeOnStart: 50
        });
    }, TypeError);
    test.is(
        executeOnStartError.message,
        "CallbackScheduler.options.executeOnStart should be a <boolean>"
    );
});

/**
 * Test CallbackScheduler - default constructor values
 */
avaTest("CallbackScheduler - default constructor values", (test) => {
    const Scheduler = new CallbackScheduler();
    test.is(Scheduler.interval, CallbackScheduler.DefaultConstructorOptions.interval);
    test.is(Scheduler.executeOnStart, CallbackScheduler.DefaultConstructorOptions.executeOnStart);
    test.is(Scheduler.started, false);
    test.is(Scheduler.initialized, false);
    test.is(is.date(Scheduler.startDate), true);
});

/**
 * Test CallbackScheduler - execute reset method
 */
avaTest("CallbackScheduler - execute reset method", (test) => {
    const Scheduler = new CallbackScheduler();
    test.is(is.nullOrUndefined(Scheduler.timer), true);
    Scheduler.reset();
    test.is(is.nullOrUndefined(Scheduler.timer), false);
    test.is(is.date(Scheduler.timer), true);
});

/**
 * Test CallbackScheduler - execute walk method (first test)
 */
avaTest("CallbackScheduler - execute walk method (first test)", async(test) => {
    const Scheduler = new CallbackScheduler({
        interval: 1
    });
    test.is(is.nullOrUndefined(Scheduler.timer), true);
    test.is(Scheduler.started, false);
    test.is(Scheduler.walk(), false);
    test.is(Scheduler.started, true);

    const ret = Scheduler.walk();
    test.is(is.date(Scheduler.timer), true);
    test.is(Scheduler.initialized, true);
    test.is(ret, false);

    await new Promise((resolve) => {
        setTimeout(() => {
            test.is(Scheduler.walk(), true);
            resolve();
        }, 1000);
    });
});


/**
 * Test CallbackScheduler - execute walk method (second test)
 */
avaTest("CallbackScheduler - execute walk method (second test)", async(test) => {
    const Scheduler = new CallbackScheduler({
        executeOnStart: true,
        interval: 2
    });
    test.is(is.nullOrUndefined(Scheduler.timer), true);
    test.is(Scheduler.started, false);
    test.is(Scheduler.walk(), true);
    test.is(Scheduler.started, true);

    await new Promise((resolve) => {
        setTimeout(() => {
            test.is(Scheduler.walk(), false);
            resolve();
        }, 1000);
    });
});

/**
 * Test CallbackScheduler - execute walk method with startDate
 */
avaTest("CallbackScheduler - execute walk method with startDate", async(test) => {
    const deltaDate = new Date();
    deltaDate.setSeconds(deltaDate.getSeconds() + 3);
    const Scheduler = new CallbackScheduler({
        startDate: deltaDate,
        interval: 1
    });
    test.is(is.nullOrUndefined(Scheduler.timer), true);
    test.is(Scheduler.started, false);
    test.is(Scheduler.walk(), false);
    test.is(Scheduler.started, true);

    await new Promise((resolve) => {
        setTimeout(() => {
            test.is(Scheduler.walk(), false);
            resolve();
        }, 1000);
    });
    await new Promise((resolve) => {
        setTimeout(() => {
            test.is(Scheduler.walk(), true);
            resolve();
        }, 3000);
    });
});

