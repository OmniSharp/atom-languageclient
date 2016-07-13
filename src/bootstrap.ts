/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable */
import { autoinject, singleton, transient } from 'aurelia-dependency-injection';
import { metadata } from 'aurelia-metadata';
import { all, factory, inject, lazy, newInstance, optional, parent } from './di/decorators';
import 'reflect-metadata';

function key(key: any) {
    return function (target: any) {
        metadata.define('di:key', key, target);
    };
}

global.key = key;
global.autoinject = autoinject;
global.singleton = singleton;
global.transient = transient;
global.all = all;
global.factory = factory;
global.inject = inject;
global.lazy = lazy;
global.newInstance = newInstance;
global.optional = optional;
