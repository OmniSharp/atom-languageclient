/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { normalize } from 'path';
import { parse } from 'url';
export function uriToFilePath(uri: string): string {
    const parsed = parse(uri);
    if (parsed.protocol !== 'file:' || !parsed.path) {
        return '';
    }
    const segments = parsed.path.split('/');
    for (let i = 0; i < segments.length; i++) {
        segments[i] = decodeURIComponent(segments[i]);
    }
    if (process.platform === 'win32' && segments.length > 1) {
        const first = segments[0];
        const second = segments[1];
        // Do we have a drive letter and we started with a / which is the
        // case if the first segement is empty (see split above)
        if (first.length === 0 && second.length > 1 && second[1] === ':') {
            // Remove first slash
            segments.shift();
        }
    }
    return normalize(segments.join('/'));
}
