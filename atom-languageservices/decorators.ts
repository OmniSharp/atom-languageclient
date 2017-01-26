import { ServerCapabilities } from './protocol';
/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
export { all, autoinject as injectable, /* factory, */ inject, lazy, newInstance, /* options, */ parent } from 'aurelia-dependency-injection';
import { metadata } from 'aurelia-metadata';
import * as symbols from './symbols';
/* tslint:disable:no-any */

/**
 * Decorator: Specifies the key to register this instance with in the container
 */
export function key(key: any) {
    return (target: any) => {
        metadata.define(symbols.key, key, target);
    };
}

/**
 * Decorator: Specifies the key to register this instance with in the container
 */
export function capability(isCompatible?: (serverCapabilities: ServerCapabilities) => boolean) {
    return (target: any) => {
        metadata.define(symbols.capability, true, target);
        metadata.define(symbols.isCompatible, true, isCompatible || (() => true));
    };
}

/**
 * Decorator: Specifies the key to register this instance with in the container
 */
export function alias(alias: symbol) {
    return (target: any) => {
        metadata.define(symbols.alias, alias, target);
    };
}
