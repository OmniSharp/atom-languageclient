import { All, Factory, Lazy, Optional, NewInstance, Parent } from 'aurelia-dependency-injection';
import { metadata } from 'aurelia-metadata';

function getDeocratorDependencies(target: any, name: string) {
    let dependencies = target.inject;
    if (typeof dependencies === 'function') {
        throw new Error('Decorator ' + name + ' cannot be used with "inject()".  Please use an array instead.');
    }
    if (!dependencies) {
        dependencies = (<any[]>metadata.getOwn(metadata.paramTypes, target)).concat();
    }
    return dependencies;
}

/**
* Decorator: Specifies the dependency should be lazy loaded
*/
export function lazy(keyValue: any) {
    return function (target: any, key: string, index: number) {
        let params = getDeocratorDependencies(target, 'lazy');
        params[index] = Lazy.of(keyValue);
    };
}

/**
* Decorator: Specifies the dependency should load all instances of the given key.
*/
export function all(keyValue: any) {
    return function (target: any, key: string, index: number) {
        let params = getDeocratorDependencies(target, 'all');
        params[index] = All.of(keyValue);
    };
}

/**
* Decorator: Specifies the dependency as optional
*/
export function optional(checkParentOrTarget: boolean = true) {
    let deco = function (checkParent: boolean) {
        return function (target: any, key: string, index: number) {
            let params = getDeocratorDependencies(target, 'optional');
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
    let params = getDeocratorDependencies(target, 'parent');
    params[index] = Parent.of(params[index]);
}

/**
* Decorator: Specifies the dependency to create a factory method, that can accept optional arguments
*/
export function factory(keyValue: any) {
    return function (target: any, key: string, index: number) {
        let params = getDeocratorDependencies(target, 'factory');
        params[index] = Factory.of(keyValue);
    };
}

/**
* Decorator: Specifies the dependency as a new instance
*/
export function newInstance(asKeyOrTarget?: any) {
    let deco = function (asKey?: any) {
        return function (target: any, key: string, index: number) {
            let params = getDeocratorDependencies(target, 'newInstance');
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
    return function (target: any, key: string, descriptor: number | any) {
        // handle when used as a parameter
        if (typeof descriptor === 'number' && rest.length === 1) {
            let params = getDeocratorDependencies(target, 'inject');
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
