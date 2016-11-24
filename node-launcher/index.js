#!/usr/bin/env node --harmony

'use strict';
var Promise = require('promise');
var fs = require('fs');
var fse = require('fs-extra');
var figlet = require('figlet');
var chalk = require('chalk');
var supportsColor = require('supports-color');
var inquirer = require('inquirer');
var shell = require("shelljs");

var username,
    project;

//Ascii Logo
console.log(
    chalk.yellow(

        figlet.textSync('Your Sweet Build Tool', {

            horizontalLayout: 'full',
            font: 'Big Money-sw',

        })
    )
);

//Callbacks
buildToolLauncherInit(function(data) {

    cloneRepo(data);

    setTimeout(function() {

        installDependenciesThenLaunch(data);

    }, 3000);

});

//Init Function
function buildToolLauncherInit(callback) {
    var questions = [{
        type: "input",
        message: 'What is your Bitbucket username? ',
        name: "username"
    }, {
        type: "input",
        message: 'What is the name of your project?',
        name: "project"
    }, {
        type: 'confirm',
        name: 'doublecheck',
        message: 'Is this correct? (just hit enter for YES)',
        default: true
    }];

    //Allow cofirmation to reset installation
    function makeSure() {
        inquirer.prompt(questions).then(function(data) {

            if (data.doublecheck) {

                return callback(data);

            } else {

                makeSure();

            }

        });
    } makeSure();
}

//Clone Repo Function
function cloneRepo(data) {

    console.log(chalk.cyan.bold('Downloading repo 👍'));

    shell.exec("git clone https://" + data.username + "@bitbucket.org/YOUR-URL.git " + data.project);
}

//Installation and Launch Function
function installDependenciesThenLaunch(data) {

    var newProject = data.project;
    fse.removeSync(newProject + "/.git");

    console.log(chalk.cyan.bold('Starting npm install 👍'));

    shell.exec('cd ' + newProject + '&& ' + 'npm install --color always');

    console.log(chalk.cyan.bold('Starting gulp 👍'));

    shell.exec('cd ' + newProject + '&& ' + 'gulp --color');
}
