'use strict';

/**
 * Dependencies
 */
var yeoman = require('yeoman-generator');
var util = require('util');
var chalk = require('chalk');

/**
 * RangGenerator
 * @constructor
 */
function RangGenerator() {
    yeoman.generators.Base.apply( this, arguments );
}

util.inherits( RangGenerator, yeoman.generators.Base );

/**
 * Show an available generator commands
 */
RangGenerator.prototype.greeting = function () {
    this.log(
        chalk.blue("\n _ __ __ _ _ __   __ _\n" +
        "| '__/ _` | '_ \\ / _` |\n" +
        "| | | (_| | | | | (_| |\n" +
        "|_|  \\__,_|_| |_|\\__, |\n" +
        "                  __/ |\n" +
        "                 |___/ \n")
    );

    this.log(
        chalk.yellow('Welcome!'),
        chalk.yellow('RANG generator allows you to create the following modules:\n')
    );

    this.log('    - screen      ' +
        '\'' + chalk.yellow('yo rang:screen') + '\'  will create a screen module with ' +
        'the controller, template and route files'
    );

    this.log('    - partial     ' +
        '\'' + chalk.yellow('yo rang:partial') + '\' will create a partial module with the template and ' +
        'optionally the controller'
    );

    this.log('    - service     ' +
        '\'' + chalk.yellow('yo rang:service') + '\' will create a service'
    );
};

module.exports = RangGenerator;
