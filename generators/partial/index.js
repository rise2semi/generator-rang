'use strict';

/**
 * Dependencies
 */
var yeoman = require('yeoman-generator');
var util = require('util');
var chalk = require('chalk');

/**
 * Configuration
 */
var config = {
    appModules: './workspace/scripts/app/appModules.js',
    partialsPath: './workspace/scripts/app/partials/',
    controllerSubPath: 'controllers/',
    viewSubPath: 'templates/'
};

/**
 * User answers
 */
var userAnswers = {
    partialName: null,
    createController: null
};

/**
 * RangPartialGenerator
 *
 * Always overwrites the file if a conflict occurred.
 * @constructor
 */
function RangPartialGenerator() {
    yeoman.generators.Base.apply( this, arguments );

    this.conflicter.force = true;

    /**
     * Show information on completion.
     */
    this.on('end', function () {
        this.log(
            '\n\n' + chalk.green('Success!') + ' Partial \'' + userAnswers.partialName + '\' created!'
        );
    }.bind( this ));
}

util.inherits( RangPartialGenerator, yeoman.generators.Base );

/**
 * Show greeting
 */
RangPartialGenerator.prototype.greeting = function () {
    this.log(
        chalk.blue("\n                                              _   _       _ \n" +
                   "                                             | | (_)     | |\n" +
                   " _ __ __ _ _ __   __ _       _ __   __ _ _ __| |_ _  __ _| |\n" +
                   "| '__/ _` | '_ \\ / _` |     | '_ \\ / _` | '__| __| |/ _` | |\n" +
                   "| | | (_| | | | | (_| |  _  | |_) | (_| | |  | |_| | (_| | |\n" +
                   "|_|  \\__,_|_| |_|\\__, | (_) | .__/ \\__,_|_|   \\__|_|\\__,_|_|\n" +
                   "                  __/ |     | |                             \n" +
                   "                 |___/      |_|                           \n")
    );

    this.log(
        chalk.yellow('Welcome! I\'ll help you create a module. Answer the following questions.\n')
    );
};

/**
 * Obtain the information which is needed to generate the module.
 */
RangPartialGenerator.prototype.prompting = function () {
    var done = this.async();

    this.prompt(
        [
            {
                type    : 'input',
                name    : 'partial',
                message : 'Partial name',
                validate: function( partial ) {
                    return ( partial.length ) ? true : 'You must provide a partial name';
                }
            },
            {
                type    : 'confirm',
                name    : 'controller',
                message : 'Need to create a controller?'
            }
        ],
        function ( answers ) {
            userAnswers.partialName = answers.partial;
            userAnswers.createController = answers.controller;

            done();
        }
    );
};

/**
* Create the module files
*/
RangPartialGenerator.prototype.writing = function () {
    var partialPath = config.partialsPath + userAnswers.partialName + '/';
    var controllerPath = partialPath + config.controllerSubPath + userAnswers.partialName + 'Controller.js';
    var viewPath = partialPath + config.viewSubPath + userAnswers.partialName + '.tmpl.html';

    // template
    this.template('./view.tmpl', viewPath, { partial: userAnswers.partialName }, {});

    if ( userAnswers.createController ) {

        // main
        this.template('./main.tmpl', partialPath + '/main.js', { partial: userAnswers.partialName }, {});

        // controller
        this.template('./controller.tmpl', controllerPath, { partial: userAnswers.partialName }, {});

    }
};

/**
* Read an application dependencies
*/
RangPartialGenerator.prototype._getDependencies = function () {
    return this.readFileAsString( config.appModules );
};

/**
* Add module as the application dependency
*/
RangPartialGenerator.prototype.updateDependencies = function () {

    // do not update dependencies, because the controller is not created
    if ( !userAnswers.createController ) {
        return;
    }

    var appModulesSrc = this._getDependencies();
    var appModules = [];
    var lastModule;

    /**
     * CommonJS RegExp
     * Find all `require('module')`
     */
    var cjsRegExp = /require\s*\(\s*["']([^'"\s]+)["']\s*\)/g;

    appModulesSrc.replace( cjsRegExp, function ( module ) {
        appModules.push( module );
    });

    lastModule = appModules.pop();

    /**
     * before:
     *     require('oldmodule')
     * after:
     *     require('oldmodule'),
     *     require('module')
     */
    appModulesSrc = appModulesSrc.replace(
        lastModule,
        lastModule + ',\n' + '        require(\'partials/' + userAnswers.partialName + '/main\')'
    );

    this.write( config.appModules, appModulesSrc );
};

module.exports = RangPartialGenerator;
