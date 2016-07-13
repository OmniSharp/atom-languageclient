/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable */
import { autoinject, singleton, transient } from 'aurelia-dependency-injection';
import { all, capability, factory, inject, key, lazy, newInstance, optional, parent } from './di/decorators';
import 'reflect-metadata';

global.autoinject = autoinject;
global.capability = capability;
global.key = key;
global.singleton = singleton;
global.transient = transient;
global.all = all;
global.factory = factory;
global.inject = inject;
global.lazy = lazy;
global.newInstance = newInstance;
