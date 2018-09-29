/* eslint no-new: off */

// Require Third-party Dependencies
const avaTest = require("ava");
const is = require("@sindresorhus/is");
const { setDriftlessTimeout } = require("driftless");

// Require Internal Dependencies
const CallbackScheduler = require("../index");

/**
 * Test CallbackScheduler static default constructor options
 */
avaTest("CallbackScheduler - default static constructor options values", (test) => {
    test.is(CallbackScheduler.DefaultConstructorOptions.interval, 36000);
    test.is(CallbackScheduler.DefaultConstructorOptions.executeOnStart, false);
    test.is(CallbackScheduler.DefaultConstructorOptions.intervalUnitType, CallbackScheduler.Types.Seconds);
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

    // Test executeOnStart argument
    const intervalUnitTypeError = test.throws(() => {
        new CallbackScheduler({
            intervalUnitType: 5
        });
    }, TypeError);
    test.is(
        intervalUnitTypeError.message,
        "CallbackScheduler.options.intervalUnitType should be typeof <string>"
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
    test.is(is.number(Scheduler.startDate), true);
});

/**
 * Test CallbackScheduler - execute reset method
 */
avaTest("CallbackScheduler - execute reset method", (test) => {
    const Scheduler = new CallbackScheduler();
    test.is(is.nullOrUndefined(Scheduler.timer), true);
    Scheduler.reset();
    test.is(is.nullOrUndefined(Scheduler.timer), false);
    test.is(is.number(Scheduler.timer), true);
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
    test.is(is.number(Scheduler.timer), true);
    test.is(ret, false);

    await new Promise((resolve) => {
        setDriftlessTimeout(() => {
            test.is(Scheduler.walk(), false);
            resolve();
        }, 500);
    });

    await new Promise((resolve) => {
        setDriftlessTimeout(() => {
            test.is(Scheduler.walk(), true);
            resolve();
        }, 500);
    });
});


// /**
//  * Test CallbackScheduler - execute walk method (second test)
//  */
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
        setDriftlessTimeout(() => {
            test.is(Scheduler.walk(), false);
            resolve();
        }, 1500);
    });

    await new Promise((resolve) => {
        setDriftlessTimeout(() => {
            test.is(Scheduler.walk(), true);
            resolve();
        }, 500);
    });
});

/**
 * Test CallbackScheduler - execute walk method with startDate
 */
avaTest("CallbackScheduler - execute walk method with startDate", async(test) => {
    const startDate = new Date();
    startDate.setSeconds(startDate.getSeconds() + 3);
    const Scheduler = new CallbackScheduler({
        startDate,
        interval: 1
    });
    test.is(is.nullOrUndefined(Scheduler.timer), true);
    test.is(Scheduler.started, false);
    test.is(Scheduler.walk(), false);
    test.is(Scheduler.started, true);

    await new Promise((resolve) => {
        setDriftlessTimeout(() => {
            test.is(Scheduler.walk(), false);
            resolve();
        }, 1000);
    });
    await new Promise((resolve) => {
        setDriftlessTimeout(() => {
            test.is(Scheduler.walk(), true);
            resolve();
        }, 3000);
    });
});

/**
 * Test CallbackScheduler - execute walk method (second test)
 */
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

    test.is(is.nullOrUndefined(Scheduler.timer), true);
    test.is(Scheduler.started, false);
    test.is(Scheduler.walk(), true);
    test.is(Scheduler.started, true);

    await new Promise((resolve) => {
        setDriftlessTimeout(() => {
            test.is(Scheduler.walk(), false);
            resolve();
        }, 100);
    });

    await new Promise((resolve) => {
        setDriftlessTimeout(() => {
            test.is(Scheduler.walk(), true);
            resolve();
        }, 200);
    });
});
