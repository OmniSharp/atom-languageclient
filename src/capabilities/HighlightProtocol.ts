/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Highlight as HighlightItem, PublishHighlightParams } from '../../atom-languageservices/types-extended';
import { Highlight, IHighlightService, ILanguageProtocolClient } from 'atom-languageservices';
import { capability, inject } from 'atom-languageservices/decorators';
import { HighlightNotification } from 'atom-languageservices/protocol-extended';
import { DisposableBase } from 'ts-disposables';
import { fromRange, fromUri } from './utils/convert';
import { AtomTextEditorSource } from '../atom/AtomTextEditorSource';

@capability()
export class HighlightProtocol extends DisposableBase {
    private _client: ILanguageProtocolClient;
    private _highlighterService: IHighlightService;
    private _highlighter: Highlight.Highlighter;
    private _atomTextEditorSource: AtomTextEditorSource;

    constructor(
        @inject(ILanguageProtocolClient) client: ILanguageProtocolClient,
        @inject(IHighlightService) highlighterService: IHighlightService,
        atomTextEditorSource: AtomTextEditorSource) {
        super();
        this._highlighterService = highlighterService;
        this._atomTextEditorSource = atomTextEditorSource;
        this._highlighter = this._highlighterService.getHighlighter();
        this._disposable.add(this._highlighter);
        this._client = client;

        this._configure();
    }

    private _updateHighlights(editor: Atom.TextEditor, added: Highlight.Item[], removed: string[]) {
        this._highlighter.updateHighlights(editor, added, removed);
    }

    private _configure() {
        this._client.onNotification(HighlightNotification.type, _.bind(this._recieveHighlights, this));
    }

    private _recieveHighlights({uri, added, removed}: PublishHighlightParams) {
        uri = fromUri(uri) || uri;
        const editor = _.find(this._atomTextEditorSource.textEditors, x => x.getPath() === uri);
        if (editor) {
            this._updateHighlights(editor, this._fromHighlights(uri, added), removed);
        }
    }

    private _fromHighlights(path: string, diagnostics: HighlightItem[]): Highlight.Item[] {
        return _.map(diagnostics, _.bind(this._fromDiagnostic, this, path));
    }

    private _fromDiagnostic(path: string, highlight: HighlightItem): Highlight.Item {
        return {
            id: highlight.id,
            range: fromRange(highlight.range),
            kind: highlight.kind
        };
    }
}
