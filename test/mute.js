/**
 * Silence Yeoman during tests
 * uses https://github.com/balderdashy/fixture-stdout
 */

'use strict';

var Fixture = require('fixture-stdout');
var fixtureOut = new Fixture();
var fixtureErr = new Fixture({
    stream: process.stderr
});

var _writesOut = [];
var _writesErr = [];

/**
 * Mute
 */
function mute() {
    var captureStdout = function ( string ) {
        _writesOut.push({ string: string });
        return false;
    };

    var captureStderr = function ( string ) {
        _writesErr.push({ string: string });
        return false;
    };

    fixtureOut.capture( captureStdout );
    fixtureErr.capture( captureStderr );
}

/**
 * Unmute
 */
function unmute() {
    fixtureOut.release();
    fixtureErr.release();
}

// Return the output that was captured
function getMutedWrites() {
    return {
        out: _writesOut,
        err: _writesErr
    }
}

module.exports.mute = mute;
module.exports.unmute = unmute;
module.exports.getMutedWrites = getMutedWrites;
