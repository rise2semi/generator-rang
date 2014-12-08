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
    screensPath: './workspace/scripts/app/screens/',
    controllerSubPath: 'controllers/',
    viewSubPath: 'templates/'
};

/**
 * User answers
 */
var userAnswers = {
    screenName: null,
    screenURL: null
};

/**
 * RangScreenGenerator
 *
 * Always overwrites the file if a conflict occurred.
 * @constructor
 */
function RangScreenGenerator() {
    yeoman.generators.Base.apply( this, arguments );

    this.conflicter.force = true;
}

util.inherits( RangScreenGenerator, yeoman.generators.Base );

/**
 * Show greeting
 */
RangScreenGenerator.prototype.greeting = function () {
    this.log(
        chalk.blue("\n _ __ __ _ _ __   __ _       ___  ___ _ __ ___  ___ _ __\n" +
        "| '__/ _` | '_ \\ / _` |     / __|/ __| '__/ _ \\/ _ \\ '_ \\ \n" +
        "| | | (_| | | | | (_| |  _  \\__ \\ (__| | |  __/  __/ | | |\n" +
        "|_|  \\__,_|_| |_|\\__, | (_) |___/\\___|_|  \\___|\\___|_| |_|\n" +
        "                  __/ |                                   \n" +
        "                 |___/                                    \n")
    );

    this.log(
        chalk.yellow('Welcome! I\'ll help you create a module. Answer the following questions.\n')
    );
};

/**
 * Obtain the information which is needed to generate the module.
 */
RangScreenGenerator.prototype.prompting = function () {
    var done = this.async();

    this.prompt(
        [
            {
                type    : 'input',
                name    : 'screen',
                message : 'Screen name',
                validate: function( screen ) {
                    return ( screen.length ) ? true : 'You must provide a screen name';
                }
            },
            {
                type    : 'input',
                name    : 'url',
                message : 'Screen URL',
                validate: function( url ) {
                    return ( url.length ) ? true : 'You must provide a screen URL';
                }
            }
        ],
        function ( answers ) {
            userAnswers.screenName = answers.screen;
            userAnswers.screenURL = answers.url;
            done();
        }
    );
};

/**
 * Create the module files
 */
RangScreenGenerator.prototype.writing = function () {
    var screenPath = config.screensPath + userAnswers.screenName + '/';
    var controllerPath = screenPath + config.controllerSubPath + userAnswers.screenName + 'Controller.js';
    var viewPath = screenPath + config.viewSubPath + userAnswers.screenName + '.tmpl.html';

    // main
    this.template('./main.tmpl', screenPath + '/main.js', {
        screen: userAnswers.screenName, url: userAnswers.screenURL
    }, {});

    // controller
    this.template('./controller.tmpl', controllerPath, {
        screen: userAnswers.screenName
    }, {});

    // template
    this.template('./view.tmpl', viewPath, {
        screen: userAnswers.screenName
    }, {});
};

/**
 * Add module as the application dependency
 */
RangScreenGenerator.prototype.updateDependencies = function () {
    var appModulesSrc = this.readFileAsString( config.appModules );
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
        lastModule + ',\n' + '        require(\'screens/' + userAnswers.screenName + '/main\')'
    );

    this.write( config.appModules, appModulesSrc );
};

/**
 * Show information on completion.
 */
RangScreenGenerator.prototype.end = function () {
    this.log(
        '\n\n' + chalk.green('Success!') + ' Screen \'' + userAnswers.screenName + '\' created!'
    );
};

module.exports = RangScreenGenerator;
