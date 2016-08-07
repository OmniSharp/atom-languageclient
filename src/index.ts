/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol to atom
 */
import './bootstrap';
import { AtomLanguageClientPackage } from './AtomLanguageClientPackage';

module.exports = new AtomLanguageClientPackage();

// const instance = (() => {
//     let i: any;
//     const ctor = require('./AtomLanguageClientPackage').AtomLanguageClientPackage;
//     return (() => {
//         if (!i) {
//             i = new ctor();
//         }
//         return i;
//     });
// })();

// const proxy = new Proxy({}, {
//     getPrototypeOf(target: any) {
//         return Object.getPrototypeOf(instance());
//     },
//     setPrototypeOf(target: any, v: any) {
//         return Object.setPrototypeOf(instance(), v);
//     },
//     isExtensible(target: any) {
//         return Object.isExtensible(instance());
//     },
//     preventExtensions(target: any) {
//         return Object.preventExtensions(instance());
//     },
//     getOwnPropertyDescriptor(target: any, p: PropertyKey) {
//         return Object.getOwnPropertyDescriptor(instance(), p);
//     },
//     has(target: any, p: PropertyKey) {
//         return p in instance();
//     },
//     get(target: any, p: PropertyKey, receiver: any) {
//         return instance()[p];
//     },
//     set(target: any, p: PropertyKey, value: any, receiver: any) {
//         return instance()[p] = value;
//     },
//     defineProperty(target: any, p: PropertyKey, attributes: PropertyDescriptor) {
//         return Object.defineProperty(instance(), p, attributes);
//     },
//     enumerate(target: any) {
//         return Object.keys(instance());
//     },
//     ownKeys(target: any) {
//         return Object.keys(instance());
//     }
// })

// module.exports = proxy;
