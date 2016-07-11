/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
export type ProtocolCodeLensItem = { data: any; };
export function isProtocolCodeLensItem(item: any): item is ProtocolCodeLensItem {
    return !!(<any>item).data;
}
