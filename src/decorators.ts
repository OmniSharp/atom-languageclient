/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { metadata } from 'aurelia-metadata';
import * as symbols from './constants';
/**
 * Decorator: To define the configuration that this feature is linked to.
 */
export function atomConfig(context: {
    description?: string;
    default: boolean;
    title?: string;
    name?: string;
}) {
    return (target: any) => {
        metadata.define(symbols.atomConfig, _.defaults(context, { type: 'boolean', title: _.startCase(target.name), name: _.camelCase(target.name) }) , target);
    };
}
