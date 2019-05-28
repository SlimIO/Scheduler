# Scheduler
![V0.6.0](https://img.shields.io/badge/version-0.6.0-blue.svg)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SlimIO/is/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)

Scheduler class are used by SlimIO Addons to schedule the execution of registered callbacks.

> ⚠️ Scheduler class are not designed to be precision timer (they are not a replacement of Node.js timers!).

<p align="center">
    <img src="https://i.imgur.com/zOtJcDm.png">
</p>


## Requirements
- Node.js v10 or higher

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i @slimio/scheduler
# or
$ yarn add @slimio/scheduler
```

## Usage example

Scheduler are often use with SlimIO Addon(s) and are not designed to be used out of the SlimIO agent.

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

<details><summary>constructor(options?: CallbackScheduler.ConstructorOptions)</summary>
<br />

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
</details>

<details><summary>reset(): void</summary>
<br />

Reset the Scheduler (it will reset inner timestamp). This method is automatically called by the `walk()` method.
</details>

<details><summary>walk(): boolean</summary>
<br />

Walk the Scheduler. It will return `false` if the time is not elapsed and `true` if the time has been elapsed. When true is returned, the timer is automatically resetted !

<p align="center">
    <b>Workflow of walk() method</b>
</p>
<p align="center">
    <img src="https://i.imgur.com/vnbqS3e.png" height="500">
</p>
</details>

<details><summary>Available Types</summary>
<br />

Scheduler support both `Seconds` and `Milliseconds` types.
```ts
interface Types {
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
</details>

## Dependencies
This project have no dependencies.

## License
MIT
