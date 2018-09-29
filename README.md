# Scheduler
Slim.IO Scheduler

> *warning* Scheduler class are not designed to be precision timer (they are not a replacement of Node.JS timers!).

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm).

```bash
$ npm install @slimio/scheduler
```

## Usage example

Scheduler are often use with SlimIO Addon(s) and are not designed to be used out of the Slim.IO product.

```js
const Addon = require("@slimio/addon");
const Scheduler = require("@slimio/scheduler");

const myAddon = new Addon("myAddon");

// Declare our sayHello function
async function sayHello() {
    console.log("hello world!");
}

// Register "sayHello" and ask it to be executed every one second
myAddon
    .registerCallback(sayHello)
    .schedule("sayHello", new Scheduler({ interval: 1 }));

module.exports = myAddon;
```

## API

### constructor(options?: CallbackScheduler.ConstructorOptions)
Construct a new Scheduler.

```js
const myScheduler = new Scheduler({
    interval: 1250,
    intervalUnitType: Scheduler.AvailableTypes.milliseconds
});
```

Available options are the following:

| argument name | type | default value | description |
| --- | --- | --- | --- |
| interval | number | 36000 | Default timer interval (in second if defaultType is not set) |
| startDate | date | Date.now() | The start date of the timer, dont set the property if you want the timer to start immediately |
| executeOnStart | boolean | false | The timer will return **true** on the very first walk() if this option is true |
| intervalUnitType | AvailableTypes | AvailableTypes.seconds | Set the type of the interval |

Available types are:

```ts
interface AvailableTypes {
    Milliseconds: "millisecond",
    Seconds: "second"
}
```

### reset(): void
Reset the Scheduler (it will reset inner date timer). This method is automatically called by the `walk()` method.

### walk(): boolean
Walk the Scheduler. It will return `false` if the time is not elapsed and `true` if the time has been elapsed. When true is returned, the timer is automatically resetted !

<p align="center">
    <img src="https://i.imgur.com/vnbqS3e.png" height="500">
</p>

### Available Types
Scheduler support both `second` and `millisecond` types. It's recommanded to set these at the construction time.

```js
const timer = new Scheduler({
    interval: 500, // Ms
    intervalUnitType: Scheduler.Types.Milliseconds
});

// [OR] Change type with the getter
// But that can be dangerous to change the nature of an existant timer
timer.type = Scheduler.Types.Seconds;
```