'use strict';

/**
 * Dependencies
 */
var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;
var output = require('./mute');

describe('rang:screen generator', function () {
    var rangScreen;
    var tempFolder = 'tmp/tmpRangScreen';
    var mockPrompts = {
        screen: 'test',
        url: 'test'
    };

    var expectedFile = [
        'workspace/scripts/app/screens/test/main.js',
        'workspace/scripts/app/screens/test/templates/test.tmpl.html',
        'workspace/scripts/app/screens/test/controllers/testController.js'
    ];

    var expectedContent = [
        [
            'workspace/scripts/app/screens/test/main.js',
            /var testTemplate = require\('text!\.\/templates\/test\.tmpl\.html'\);/
        ],
        [
            'workspace/scripts/app/screens/test/main.js',
            /var testController = require\('\.\/controllers\/testController'\);/
        ],
        [ 'workspace/scripts/app/screens/test/main.js', /Module: test screen/ ],
        [ 'workspace/scripts/app/screens/test/main.js', /var module = angular.module\('app\.test', \[]\);/ ],
        [ 'workspace/scripts/app/screens/test/main.js', /controller\( testController \)/ ],
        [ 'workspace/scripts/app/screens/test/main.js', /state\('root\.test'/ ],
        [ 'workspace/scripts/app/screens/test/main.js', /url: '\/test',/ ],
        [ 'workspace/scripts/app/screens/test/main.js', /template: testTemplate,/ ],
        [ 'workspace/scripts/app/screens/test/main.js', /controller: 'testController'/ ],
        [ 'workspace/scripts/app/screens/test/controllers/testController.js', /testController:/ ],
        [ 'workspace/scripts/app/appModules.js', /require\('screens\/test\/main'\)/ ]
    ];

    beforeEach(function (done) {
        helpers.testDirectory( path.join( __dirname, tempFolder ), function ( error ) {
            if ( error ) {
                done( error );
            }

            rangScreen = helpers.createGenerator( 'rang:screen', ['../../../generators/screen'], [], {} );
            rangScreen.on('run', output.mute);
            rangScreen.on('end', output.unmute);

            helpers.stub( rangScreen, '_getDependencies', function () {
                return "return [\n" +
                    "        require('screens/old/module')\n" +
                    "];";
            });

            done();
        });
    });

    it('should generate the expected files and their content', function ( done ) {
        helpers.mockPrompt( rangScreen, mockPrompts );

        rangScreen.run({}, function () {

            assert.file( expectedFile );
            assert.fileContent( expectedContent );

            done();
        });
    });
});
