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

// Register "sayHello" and ask it to be executed every 1,000ms
myAddon
    .registerCallback(sayHello)
    .schedule("sayHello", new Scheduler({ interval: 1000 }));

module.exports = myAddon;
```

## API

### constructor(options?: CallbackScheduler.ConstructorOptions)
Construct a new Scheduler. Available options are following the below interface:

```ts
interface ConstructorOptions {
    interval?: number;
    startDate?: date;
    executeOnStart?: boolean;
}
```

### reset()
Reset the Scheduler (it will reset inner date timer).

### walk()
Walk the Scheduler. It will return `false` if the time is not elapsed and `true` if the time has been elapsed. When true is returned, the timer is automatically resetted !