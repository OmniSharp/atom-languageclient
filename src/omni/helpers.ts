/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol to atom
 */
import { Observable, Scheduler } from 'rxjs';
import { ILanguageClientTextEditor } from './ILanguageClientTextEditor';

const DEBOUNCE_TIMEOUT = 100;

export function subscribeAsync(observable: Observable<ILanguageClientTextEditor>) {
    return observable
        .subscribeOn(Scheduler.async)
        .observeOn(Scheduler.async)
        .filter(editor => !editor || editor && !editor.isDestroyed());
}

export function ensureEditor(observable: Observable<ILanguageClientTextEditor>) {
    return observable
        .filter(editor => !editor || editor && !editor.isDestroyed());
}

export function cacheEditor(observable: Observable<ILanguageClientTextEditor>) {
    return observable
        .debounceTime(DEBOUNCE_TIMEOUT)
        .publishReplay(1).refCount();
}
