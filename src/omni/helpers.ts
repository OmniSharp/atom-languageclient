/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol to atom
 */
import { Observable, Scheduler } from 'rxjs';
import { IOmniTextEditor } from './IOmniTextEditor';

const DEBOUNCE_TIMEOUT = 100;

export function subscribeAsync(observable: Observable<IOmniTextEditor>) {
    return observable
        .subscribeOn(Scheduler.async)
        .observeOn(Scheduler.async)
        .filter(editor => !editor || editor && !editor.isDestroyed());
}

export function ensureEditor(observable: Observable<IOmniTextEditor>) {
    return observable
        .filter(editor => !editor || editor && !editor.isDestroyed());
}

export function cacheEditor(observable: Observable<IOmniTextEditor>) {
    return observable
        .debounceTime(DEBOUNCE_TIMEOUT)
        .cache(1);
}
