/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { All, Factory, Lazy, NewInstance, Optional, Parent } from 'aurelia-dependency-injection';
export { autoinject as injectable } from 'aurelia-dependency-injection';
import { metadata } from 'aurelia-metadata';
import * as symbols from './symbols';
/* tslint:disable:no-any */
function getDeocratorDependencies(target: any, name: string) {
    let dependencies = target.inject;
    if (typeof dependencies === 'function') {
        throw new Error('Decorator ' + name + ' cannot be used with "inject()".  Please use an array instead.');
    }
    if (!dependencies) {
        dependencies = (<any[]>metadata.getOwn(metadata.paramTypes, target)).concat();
        target.inject = dependencies;
    }
    return dependencies;
}

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
export function capability(target: any) {
    metadata.define(symbols.capability, true, target);
}

/**
 * Decorator: Specifies the dependency should be lazy loaded
 */
export function lazy(keyValue: any) {
    return (target: any, key: string, index: number) => {
        const params = getDeocratorDependencies(target, 'lazy');
        params[index] = Lazy.of(keyValue);
    };
}

/**
 * Decorator: Specifies the dependency should load all instances of the given key.
 */
export function all(keyValue: any) {
    return (target: any, key: string, index: number) => {
        const params = getDeocratorDependencies(target, 'all');
        params[index] = All.of(keyValue);
    };
}

/**
 * Decorator: Specifies the dependency as optional
 */
export function optional(checkParentOrTarget: boolean = true) {
    const deco = (checkParent: boolean) => {
        return (target: any, key: string, index: number) => {
            const params = getDeocratorDependencies(target, 'optional');
            params[index] = Optional.of(params[index], checkParent);
        };
    };
    if (typeof checkParentOrTarget === 'boolean') {
        return deco(checkParentOrTarget);
    }
    return deco(true);
}

/**
 * Decorator: Specifies the dependency to look at the parent container for resolution
 */
export function parent(target: any, key: string, index: number) {
    const params = getDeocratorDependencies(target, 'parent');
    params[index] = Parent.of(params[index]);
}

/**
 * Decorator: Specifies the dependency to create a factory method, that can accept optional arguments
 */
export function factory(keyValue: any) {
    return (target: any, key: string, index: number) => {
        const params = getDeocratorDependencies(target, 'factory');
        params[index] = Factory.of(keyValue);
    };
}

/**
 * Decorator: Specifies the dependency as a new instance
 */
export function newInstance(asKeyOrTarget?: any) {
    const deco = (asKey?: any) => {
        return (target: any, key: string, index: number) => {
            const params = getDeocratorDependencies(target, 'newInstance');
            params[index] = NewInstance.of(params[index]);
            if (!!asKey) {
                params[index].as(asKey);
            }
        };
    };
    if (arguments.length === 1) {
        return deco(asKeyOrTarget);
    }
    return deco();
}

/**
 * Decorator: Specifies the dependencies that should be injected by the DI Container into the decoratored class/function.
 */
export function inject(...rest: any[]): any {
    return (target: any, key: string, descriptor: number | any) => {
        // handle when used as a parameter
        if (typeof descriptor === 'number' && rest.length === 1) {
            const params = getDeocratorDependencies(target, 'inject');
            params[descriptor] = rest[0];
            return;
        }
        // if it's true then we injecting rest into function and not Class constructor
        if (descriptor) {
            const fn = descriptor.value;
            fn.inject = rest;
        } else {
            target.inject = rest;
        }
    };
}
