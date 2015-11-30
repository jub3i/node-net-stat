var fs = require('fs');

module.exports = {
  totalRx: totalRx,
  totalTx: totalTx,
  usageRx: usageRx,
  usageTx: usageTx,
  raw: raw,
};

/* PUBLIC */

function totalRx(opts) {
  if (opts) {
    opts.iface = opts.iface || 'lo';
    opts.units = opts.units || 'bytes';
  } else {
    opts = {
      iface: 'lo',
      units: 'bytes',
    };
  }

  var total = parseInt(_parseProcNetDev()[opts.iface].bytes.receive);
  var converted = _bytesTo(total, opts.units);

  return converted;
}

function totalTx(opts) {
  if (opts) {
    opts.iface = opts.iface || 'lo';
    opts.units = opts.units || 'bytes';
  } else {
    opts = {
      iface: 'lo',
      units: 'bytes',
    };
  }

  var total = parseInt(_parseProcNetDev()[opts.iface].bytes.transmit);
  var converted = _bytesTo(total, opts.units);

  return converted;
}

function usageRx(iface, units, sampleMs, cb) {
  iface = iface || 'lo';
  units = units || 'bytes';
  sampleMs = sampleMs || 1000;

  var time;
  var totalDelta0 = _parseProcNetDev()[iface].bytes.receive;
  time = process.hrtime();

  setTimeout(function() {
    var totalDelta1 = _parseProcNetDev()[iface].bytes.receive;

    var diff = process.hrtime(time);
    var diffSeconds = diff[0] + diff[1] * 1e-9;

    var total = parseInt(totalDelta1) - parseInt(totalDelta0);
    var totalPerSecond = total / (diffSeconds * diffSeconds);
    var converted = _bytesTo(totalPerSecond, units);

    return cb(converted);
  }, sampleMs);
}

function usageTx(iface, units, sampleMs, cb) {
  iface = iface || 'lo';
  units = units || 'bytes';
  sampleMs = sampleMs || 1000;

  var time;
  var totalDelta0 = _parseProcNetDev()[iface].bytes.transmit;
  time = process.hrtime();

  setTimeout(function() {
    var totalDelta1 = _parseProcNetDev()[iface].bytes.transmit;

    var diff = process.hrtime(time);
    var diffSeconds = diff[0] + diff[1] * 1e-9;

    var total = parseInt(totalDelta1) - parseInt(totalDelta0);
    var totalPerSecond = total / (diffSeconds * diffSeconds);
    var converted = _bytesTo(totalPerSecond, units);

    return cb(converted);
  }, sampleMs);
}

//NOTE: can use this function to determine what interfaces are available by listing
//the return objects keys
//NOTE: raw `/proc/net/dev` as object
function raw() {
  return _parseProcNetDev();
}

/* PRIVATE */

//NOTE: borrowed/modifed from `https://github.com/soldair/node-procfs-stats/blob/feca2a940805b31f9e7d5c0bd07c4e3f8d3d5303/index.js#L343`
//TODO: more cleaning, rename the one char variables to something more expressive
function _parseProcNetDev() {
  var buf = fs.readFileSync('/proc/net/dev');
  var lines = buf.toString().trim().split('\n');
  var sections = lines.shift().split('|');
  var columns = lines.shift().trim().split('|');

  var s;
  var l;
  var c;
  var p = 0;
  var map = {};
  var keys = [];
  for (var i = 0; i < sections.length; ++i) {
    s = sections[i].trim();
    l = sections[i].length;
    c = columns[i].trim().split(/\s+/g);
    while (c.length) {
      map[keys.length] = s;
      keys.push(c.shift());
    }
    p += s.length + 1;
  }

  var retObj = {};

  lines.forEach(function(l) {
    l = l.trim().split(/\s+/g);
    var o = {};
    var iface;
    for (var i = 0; i < l.length; ++i) {
      var s = map[i];

      //case for the Interface
      if (s.indexOf('-') === s.length - 1) {
        iface = l[i].substr(0, l[i].length - 1);

      //case for everything else
      } else {
        if (!o[keys[i]]) {
          o[keys[i].toLowerCase()] = {};
        }
        o[keys[i].toLowerCase()][s.toLowerCase()] = l[i];
      }
    }
    retObj[iface] = o;
  });

  return retObj;
}

function _bytesTo(bytes, units) {
  var KiB = 1024;
  var MiB = 1024 * KiB;
  var GiB = 1024 * MiB;

  switch (units) {
    case 'bytes':
      break;
    case 'KiB':
      bytes /= KiB;
      break;
    case 'MiB':
      bytes /= MiB;
      break;
    case 'GiB':
      bytes /= GiB;
      break;
    default:
      var errMsg =
        '[net-stats] Error: Unknown units "' + units + '", use one of: ' +
        '"bytes" (default), "KiB", "MiB" or "GiB"';
      console.log(errMsg);
  }

  //NOTE: the variable named `bytes` may not actually contain a number
  //representing the number of bytes. its done this way to only have to use one
  //variable.
  return bytes;
}
