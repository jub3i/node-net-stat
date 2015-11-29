net-stat
========

```
  ______  _______ _______ _______ _______ _______ _______
 |   _  \|   _   |       |   _   |       |   _   |       |
 |.  |   |.  1___|.|   | |   1___|.|   | |.  1   |.|   | |
 |.  |   |.  __)_`-|.  |-|____   `-|.  |-|.  _   `-|.  |-'
 |:  |   |:  1   | |:  | |:  1   | |:  | |:  |   | |:  |
 |::.|   |::.. . | |::.| |::.. . | |::.| |::.|:. | |::.|
 `--- ---`-------' `---' `-------' `---' `--- ---' `---'
```

**Note:** This repo can be found on npm here: [net-stat](https://www.npmjs.com/package/net-stat)

**Caveat:** Works by parsing `/proc/net/dev` - so will only work on nix OS.

Install
-------

```
npm install net-stat
```

Example
-------

```
var netStat = require('net-stat');

//by default returns values in bytes
var totalrx = netStat.totalRx('eth0');
console.log(totalrx);

//return value in GiB, see docs below for allowed values of units
var totalrx = netStat.totalRx('eth0', 'GiB');
console.log(totalrx);

//calculate the average received KiB per second of eth0 over the next 3000ms
netStat.usageRx('eth0', 'KiB', 3000, function(data) {
    console.log('Transmitted ' + data + ' kb/s');
});

//get all fields available from `/proc/net/dev`
var allStats = netStat.raw();
console.log(allStats);
```

totalRx(iface, units)
---------------------

Returns an integer representing the number of `units` received on `iface`.

Option        | Type         | Default       | Explanation
------------- | -------------| ------------- | ------------
iface         | `String`     | `'lo'`        | The name of the interface to be used. See the `raw()` function for a list of interfaces.
units         | `String`     | `'bytes'`     | The units of the returned value, can be one of `bytes`, `KiB`, `MiB` or `GiB`.

totalTx(iface, units)
---------------------

Returns an integer representing the number of `units` transmitted on `iface`.

Option        | Type         | Default       | Explanation
------------- | -------------| ------------- | ------------
iface         | `String`     | `'lo'`        | The name of the interface to be used. See the `raw()` function for a list of interfaces.
units         | `String`     | `'bytes'`     | The units of the returned value, can be one of `bytes`, `KiB`, `MiB` or `GiB`.

usageRx(iface, units, sampleMs, cb)
-----------------------------------

Async function which returns `data`, the usage received per second in `units` on `iface` over `sampleMs`

Option        | Type         | Default       | Explanation
------------- | -------------| ------------- | ------------
iface         | `String`     | `'lo'`        | The name of the interface to be used. See the `raw()` function for a list of interfaces.
units         | `String`     | `'bytes'`     | The units of the returned value, can be one of `bytes`, `KiB`, `MiB` or `GiB`.
sampleMs      | `Number`     | `1000`        | The number of milliseconds to take a usage sample over.
cb            | `Function`   | none          | A callback function with signature `cb(data)` where `data` is the usage received per second in `units` on `iface` over `sampleMs`.

usageTx(iface, units, sampleMs, cb)
-----------------------------------

Async function which returns `data`, the usage transmitted per second in `units` on `iface` over `sampleMs`

Option        | Type         | Default       | Explanation
------------- | -------------| ------------- | ------------
iface         | `String`     | `'lo'`        | The name of the interface to be used. See the `raw()` function for a list of interfaces.
units         | `String`     | `'bytes'`     | The units of the returned value, can be one of `bytes`, `KiB`, `MiB` or `GiB`.
sampleMs      | `Number`     | `1000`        | The number of milliseconds to take a usage sample over.
cb            | `Function`   | none          | A callback function with signature `cb(data)` where `data` is the usage transmitted per second in `units` on `iface` over `sampleMs`.

raw()
-----

Returns an object representing the data in `/proc/net/dev`.

Contributing
------------

Just send a PR, or create an issue if you are not sure.

Areas ripe for contribution:
- testing
- cross compatability for windows and darwin/osx
- performance
- bugs

License
-------

MIT
