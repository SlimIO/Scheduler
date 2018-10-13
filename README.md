# Scheduler
Scheduler class are used by SlimIO Addons to schedule the execution of registered callbacks.

> *warning* Scheduler class are not designed to be precision timer (they are not a replacement of Node.JS timers!).

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i @slimio/scheduler
# or
$ yarn add @slimio/scheduler
```

## Usage example

Scheduler are often use with SlimIO Addon(s) and are not designed to be used out of the Slim.IO product.

```js
const Addon = require("@slimio/addon");
const Scheduler = require("@slimio/scheduler");

// Create your Addon
const myAddon = new Addon("myAddon");

// Create a sayHello function (our callback).
async function sayHello() {
    console.log("hello world!");
}

// Register "sayHello" callback and ask to schedule it every second (so it will be executed every second by Addon).
myAddon
    .registerCallback("say_hello", sayHello)
    .schedule(new Scheduler({ interval: 1 }));

module.exports = myAddon;
```

## API

### constructor(options?: CallbackScheduler.ConstructorOptions)
Construct a new Scheduler.

```js
const myScheduler = new Scheduler({
    interval: 1250,
    intervalUnitType: Scheduler.Types.milliseconds
});
```

Available options are the following:

| argument name | type | default value | description |
| --- | --- | --- | --- |
| interval | number | 36000 | Default timer interval (in second if defaultType is not set) |
| startDate | date | Date.now() | The start date of the timer, dont set the property if you want the timer to start immediately |
| executeOnStart | boolean | false | The timer will return **true** on the very first walk() if this option is true |
| intervalUnitType | AvailableTypes | Types.seconds | Set the type of the interval |

Available types are:

```ts
interface AvailableTypes {
    Milliseconds: "millisecond",
    Seconds: "second"
}
```

### reset(): void
Reset the Scheduler (it will reset inner timestamp). This method is automatically called by the `walk()` method.

### walk(): boolean
Walk the Scheduler. It will return `false` if the time is not elapsed and `true` if the time has been elapsed. When true is returned, the timer is automatically resetted !

<p align="center">
    <b>Workflow of walk() method</b>
    <img src="https://i.imgur.com/vnbqS3e.png" height="500">
</p>

### Available Types
Scheduler support both `Seconds` and `Milliseconds` types.
```ts
interface AvailableTypes {
    Milliseconds: "millisecond",
    Seconds: "second"
}
```
It's recommanded to set the type at the initialization of the Scheduler. (Avoir updating the type on the fly).

```js
const timer = new Scheduler({
    interval: 500, // Ms
    intervalUnitType: Scheduler.Types.Milliseconds
});

timer.type = Scheduler.Types.Seconds;
```
