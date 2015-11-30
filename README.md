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

**Note:** This repo can be found on github here: [node-net-stat](https://github.com/jub3i/node-net-stat)

**Caveat:** Works by parsing `/proc/net/dev`, so will only work on nix OS.

Install
-------

```
npm install net-stat
```

Examples
--------

Require the module:
```
var netStat = require('net-stat');
```

By default `totalRx()` returns total received bytes for interface `lo`:
```
var totalrx = netStat.totalRx();
console.log(totalrx);
```

Return total received GiB on interface `eth0`, see docs below for accepted values of `units` and `iface`:
```
var totalrx = netStat.totalRx({ iface: 'eth0', units: 'GiB' });
console.log(totalrx);
```

Display the transmitted KiB per second of `eth0` over the next 2000ms:
```
setInterval(function() {
  netStat.usageTx({
    iface: 'eth0',
    units: 'KiB',
    sampleMs: 2000,
  }, function(kbps) {
    console.log('Transmitted ' + kbps + ' kb/s');
  });
}, 2500);
```

Get all fields available from `/proc/net/dev`, useful for finding accepted values of `iface`:
```
var allStats = netStat.raw();
console.log(allStats);
```

totalRx([opts])
---------------------

Returns a number representing the number of `units` received on `iface`.

Option        | Type         | Default       | Explanation
------------- | -------------| ------------- | ------------
opts          | `Object`     | see below     | Options object, specify what you need, the defaults will be filled in
opts.iface    | `String`     | `'lo'`        | The name of the interface to be used. See the `raw()` function for a list of interfaces.
opts.units    | `String`     | `'bytes'`     | The units of the returned value, can be one of `bytes`, `KiB`, `MiB` or `GiB`.

totalTx([opts])
---------------------

Returns a number representing the number of `units` transmitted on `iface`.

Option        | Type         | Default       | Explanation
------------- | -------------| ------------- | ------------
opts          | `Object`     | see below     | Options object, specify what you need, the defaults will be filled in
opts.iface    | `String`     | `'lo'`        | The name of the interface to be used. See the `raw()` function for a list of interfaces.
opts.units    | `String`     | `'bytes'`     | The units of the returned value, can be one of `bytes`, `KiB`, `MiB` or `GiB`.

usageRx([opts,] cb)
-------------------

Async function which returns `data`, the usage received per second in `units` on `iface` over `sampleMs`

Option        | Type         | Default       | Explanation
------------- | -------------| ------------- | ------------
opts          | `Object`     | see below     | Options object, specify what you need, the defaults will be filled in
opts.iface    | `String`     | `'lo'`        | The name of the interface to be used. See the `raw()` function for a list of interfaces.
opts.units    | `String`     | `'bytes'`     | The units of the returned value, can be one of `bytes`, `KiB`, `MiB` or `GiB`.
opts.sampleMs | `Number`     | `1000`        | The number of milliseconds to take a usage sample over.
cb            | `Function`   | none          | A callback function with signature `cb(data)` where `data` is the usage received per second in `units` on `iface` over `sampleMs`.

usageTx([opts,] cb)
-------------------

Async function which returns `data`, the usage transmitted per second in `units` on `iface` over `sampleMs`

Option        | Type         | Default       | Explanation
------------- | -------------| ------------- | ------------
opts          | `Object`     | see below     | Options object, specify what you need, the defaults will be filled in
opts.iface    | `String`     | `'lo'`        | The name of the interface to be used. See the `raw()` function for a list of interfaces.
opts.units    | `String`     | `'bytes'`     | The units of the returned value, can be one of `bytes`, `KiB`, `MiB` or `GiB`.
opts.sampleMs | `Number`     | `1000`        | The number of milliseconds to take a usage sample over.
cb            | `Function`   | none          | A callback function with signature `cb(data)` where `data` is the usage transmitted per second in `units` on `iface` over `sampleMs`.

raw()
-----

Returns an object representing the data in `/proc/net/dev`.

```
{
  eth0: {
    bytes: { receive: '2085477580', transmit: '187911353' },
    packets: { receive: '1782197', transmit: '1353772' },
    errs: { receive: '0', transmit: '0' },
    drop: { receive: '42', transmit: '0' },
    fifo: { receive: '0', transmit: '0' },
    frame: { receive: '0' },
    compressed: { receive: '0', transmit: '0' },
    multicast: { receive: '7923' },
    colls: { transmit: '0' },
    carrier: { transmit: '0' }
  },
  lo: {
    bytes: { receive: '52720310', transmit: '52720310' },
    packets: { receive: '443962', transmit: '443962' },
    errs: { receive: '0', transmit: '0' },
    drop: { receive: '0', transmit: '0' },
    fifo: { receive: '0', transmit: '0' },
    frame: { receive: '0' },
    compressed: { receive: '0', transmit: '0' },
    multicast: { receive: '0' },
    colls: { transmit: '0' },
    carrier: { transmit: '0' }
  },
}
```

Contributing
------------

Just send a PR, or create an issue if you are not sure.

Areas ripe for contribution:
- testing
- cross compatability for windows and darwin/osx
- performance
- bugs

Other Stat Modules
------------------

- cpu-stat [npm](https://www.npmjs.com/package/cpu-stat) [git](https://github.com/jub3i/node-cpu-stat)
- net-stat [npm](https://www.npmjs.com/package/net-stat) [git](https://github.com/jub3i/node-net-stat)
- disk-stat [npm](https://www.npmjs.com/package/disk-stat) [git](https://github.com/jub3i/node-disk-stat)
- mem-stat [npm](https://www.npmjs.com/package/mem-stat) [git](https://github.com/jub3i/node-mem-stat)

**Note:** `net-stat`, `disk-stat`, `mem-stat` only work on nix platforms.

License
-------

MIT
