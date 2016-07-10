/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable */
import { autoinject, singleton, transient } from 'aurelia-dependency-injection';
import { metadata } from 'aurelia-metadata';
import 'reflect-metadata';

function key(key: any) {
    return function (target: any) {
        metadata.define('di:key', key, target);
    };
}

global.key = key;
global.inject = autoinject;
global.singleton = singleton;
global.transient = transient;
