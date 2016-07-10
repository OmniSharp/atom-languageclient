/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol to atom
 */
import { autoinject, singleton, transient } from 'aurelia-dependency-injection';
import { AtomLanguageClientPackage } from './AtomLanguageClientPackage';
global.inject = autoinject;
global.singleton = singleton;
global.transient = transient;

module.exports = new AtomLanguageClientPackage();
