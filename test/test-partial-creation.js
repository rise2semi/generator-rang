'use strict';

/**
 * Dependencies
 */
var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;
var output = require('./mute');

describe('rang:partial generator', function () {
    var rangPartial;
    var tempFolder = 'tmp/tmpRangPartial';
    var expected = {
        withController: {
            exist: [
                'workspace/scripts/app/partials/test/main.js',
                'workspace/scripts/app/partials/test/templates/test.tmpl.html',
                'workspace/scripts/app/partials/test/controllers/testController.js'
            ]
        },
        withoutController: {
            exist: [
                'workspace/scripts/app/partials/test/templates/test.tmpl.html'
            ],
            notExist: [
                'workspace/scripts/app/partials/test/main.js',
                'workspace/scripts/app/partials/test/controllers/testController.js'
            ]
        }

    };

    var expectedContent = [
        [
            'workspace/scripts/app/partials/test/main.js',
            /var testController = require\('\.\/controllers\/testController'\);/
        ],
        [ 'workspace/scripts/app/partials/test/main.js', /Module: test partial/ ],
        [
            'workspace/scripts/app/partials/test/main.js',
            /return angular\.module\('app.test', \[]\)\.controller\( testController \);/
        ],
        [ 'workspace/scripts/app/partials/test/controllers/testController.js', /testController:/ ],
        [ 'workspace/scripts/app/appModules.js', /require\('partials\/test\/main'\)/ ]
    ];

    beforeEach(function ( done ) {
        helpers.testDirectory( path.join( __dirname, tempFolder ), function ( error ) {
            if ( error ) {
                done( error );
            }

            rangPartial = helpers.createGenerator( 'rang:partial', ['../../../generators/partial'], [], {} );
            rangPartial.on('run', output.mute);
            rangPartial.on('end', output.unmute);

            helpers.stub( rangPartial, '_getDependencies', function () {
                return "return [\n" +
                    "        require('partials/old/module')\n" +
                    "];";
            });

            done();
        });
    });

    it('should generate the partial without controller', function ( done ) {
        helpers.mockPrompt( rangPartial, { partial: 'test', controller: false } );

        rangPartial.run( {}, function () {

            assert.file( expected.withoutController.exist );
            assert.noFile( expected.withoutController.notExist );

            done();
        });
    });

    it('should generate the partial with controller and main files and their content', function ( done ) {
        helpers.mockPrompt( rangPartial, { partial: 'test', controller: true } );

        rangPartial.run( {}, function () {

            assert.file( expected.withController.exist );
            assert.fileContent( expectedContent );

            done();
        });
    });
});
