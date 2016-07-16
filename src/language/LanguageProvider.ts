/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Disposable, DisposableBase, IDisposable, isDisposable } from 'ts-disposables';
import { ILanguageProtocolClientOptions, ILanguageProvider, ISyncExpression } from '../interfaces';
import { AtomTextEditorSource } from '../atom/AtomTextEditorSource';
import { Container } from '../di/Container';

/**
 * Takes in all the different languages provided by other packages and configures them.
 */
export class LanguageProvider extends DisposableBase {
    private _container: Container;
    private _atomTextEditorSource: AtomTextEditorSource;
    constructor(container: Container) {
        super();
        this._container = container;
    }

    public add(provider: ILanguageProvider): void {
        if (!this._atomTextEditorSource) {
            this._atomTextEditorSource = this._container.resolve(AtomTextEditorSource);
        }

        this._container.resolveCapabilities

        this._disposable.add(new LanguageProtocolContainer(provider));
    }
}

export class LanguageProtocolContainer extends DisposableBase {
    private _syncExpression: ISyncExpression;
    private _options: ILanguageProtocolClientOptions;
    public constructor(provider: ILanguageProvider) {
        super();
        if (isDisposable(provider)) {
            this._disposable.add(provider);
        }

        this._options = provider.options;
        this._syncExpression = this._buildSyncExpressions();
    }

    private _buildSyncExpressions() {

    }
}

function createSyncExpression(options: ILanguageProtocolClientOptions) {
    let grammarNameSelectors: string[] | null = null;
    let grammarScopeNameSelectors: string[] | null = null;
    let extensionSelectors: string[] | null = null;
    let textDocumentFilter: ((editor: Atom.TextEditor) => boolean) | null = null;

    if (options.documentSelector) {
        if (_.isArray(options.documentSelector)) {
            grammarNameSelectors = options.documentSelector;
        } else {
            grammarNameSelectors = [options.documentSelector];
        }
    }

    if (options.synchronize) {
        const synchronize = options.synchronize;
        if (synchronize.grammarScopeSelector) {
            if (_.isArray(synchronize.grammarScopeSelector)) {
                grammarScopeNameSelectors = synchronize.grammarScopeSelector;
            } else {
                grammarScopeNameSelectors = [synchronize.grammarScopeSelector];
            }
        }

        if (synchronize.extensionSelector) {
            if (_.isArray(synchronize.extensionSelector)) {
                extensionSelectors = synchronize.extensionSelector;
            } else {
                extensionSelectors = [synchronize.extensionSelector];
            }
        }

        if (synchronize.textDocumentFilter) {
            textDocumentFilter = synchronize.textDocumentFilter;
        }
    }

    const syncExpressions: ISyncExpression[] = [];

    if (grammarNameSelectors) {
        syncExpressions.push(..._.map(grammarNameSelectors, selector => new GrammarNameExpression(selector)));
    }

    if (extensionSelectors) {
        syncExpressions.push(..._.map(extensionSelectors, selector => new GrammarFileTypeExpression(selector)));
    }

    if (grammarScopeNameSelectors) {
        syncExpressions.push(..._.map(grammarScopeNameSelectors, selector => new GrammarScopeNameExpression(selector)));
    }

    if (textDocumentFilter) {
        syncExpressions.push(new TextEditorSyncExpression(textDocumentFilter));
    }

    if (!syncExpressions.length) {
        return new FalseSyncExpression();
    }

    if (syncExpressions.length === 1) {
        return syncExpressions[0];
    }

    return new CompositeSyncExpression(syncExpressions);
}

class FalseSyncExpression implements ISyncExpression {
    public evaluate(editor: Atom.TextEditor): boolean {
        return false;
    }
}

class GrammarNameExpression implements ISyncExpression {
    private _id: RegExp;
    constructor(id: string) {
        this._id = new RegExp(`^${id}$`, 'i');
    }

    public evaluate(editor: Atom.TextEditor): boolean {
        const grammar = editor.getGrammar();
        return !!grammar.name.match(this._id);
    }
}

class GrammarFileTypeExpression implements ISyncExpression {
    private static _regexpCache = new Map<string, RegExp[]>();
    private static _filterPredicate = _.negate(_.partial(_.isEqual, 'source'));
    private _id: RegExp;
    constructor(id: string) {
        this._id = new RegExp(`^${_.trimStart(id, '.')}$`, 'i');
    }

    public evaluate(editor: Atom.TextEditor): boolean {
        const grammar = editor.getGrammar();
        return _.some(grammar.fileTypes, ft => ft.match(this._id));
    }
}

class GrammarScopeNameExpression implements ISyncExpression {
    private static _regexpCache = new Map<string, RegExp[]>();
    private static _filterPredicate = _.negate(_.partial(_.isEqual, 'source'));
    private _id: string;
    constructor(id: string) {
        this._id = id;
    }

    public evaluate(editor: Atom.TextEditor): boolean {
        const grammar = editor.getGrammar();
        let regexps = GrammarScopeNameExpression._regexpCache.get(grammar.name);
        if (!regexps) {
            regexps = _(grammar.scopeName.split('.')).filter(GrammarScopeNameExpression._filterPredicate).map(name => new RegExp(`^${name}$`, 'i')).value();
            GrammarScopeNameExpression._regexpCache.set(grammar.name, regexps);
        }

        return _.some(regexps, name => this._id.match(name));
    }
}

class TextEditorSyncExpression implements ISyncExpression {
    private _func: (editor: Atom.TextEditor) => boolean;
    constructor(func: (editor: Atom.TextEditor) => boolean) {
        this._func = func;
    }
    public evaluate(editor: Atom.TextEditor): boolean {
        return this._func(editor);
    }
}

class CompositeSyncExpression implements ISyncExpression {
    private _expression: ISyncExpression[];
    constructor(values: ISyncExpression[]) {
        this._expression = values;
    }
    public evaluate(editor: Atom.TextEditor): boolean {
        return this._expression.some(exp => exp.evaluate(editor));
    }
}
