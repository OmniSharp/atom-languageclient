/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import * as toUri from 'file-url';
import { DisposableBase } from 'ts-disposables';
import { capability, inject } from '../services/_decorators';
import { AtomFormat, IFormatProvider, IFormatService, ILanguageProtocolClient, ISyncExpression } from '../services/_public';
import { fromTextEdits, toRange } from './utils/convert';
import { MarkedString, TextDocumentIdentifier } from '../vscode-languageserver-types';
import { DocumentFormattingParams, DocumentFormattingRequest, DocumentRangeFormattingParams, DocumentRangeFormattingRequest } from '../vscode-protocol';

@capability
export class LanguageProtocolFormat extends DisposableBase {
    private _client: ILanguageProtocolClient;
    private _syncExpression: ISyncExpression;
    private _FormatService: IFormatService;
    constructor(
        @inject(ILanguageProtocolClient) client: ILanguageProtocolClient,
        @inject(IFormatService) finderService: IFormatService,
        @inject(ISyncExpression) syncExpression: ISyncExpression
    ) {
        super();
        this._client = client;
        this._FormatService = finderService;
        this._syncExpression = syncExpression;

        if (this._client.capabilities.documentFormattingProvider) {
            const service = new FormatDocumentProvider(client, syncExpression);
            this._disposable.add(service);
            this._FormatService.registerProvider(service);
        }
        if (this._client.capabilities.documentRangeFormattingProvider) {
            const service = new FormatRangeProvider(client, syncExpression);
            this._disposable.add(service);
            this._FormatService.registerProvider(service);
        }
        // TODO: Handle trigger characters
    }
}

class FormatRangeProvider extends DisposableBase implements IFormatProvider {
    private _client: ILanguageProtocolClient;
    private _syncExpression: ISyncExpression;
    public constructor(client: ILanguageProtocolClient, syncExpression: ISyncExpression) {
        super();
        this._client = client;
        this._syncExpression = syncExpression;
    }

    public request(options: Format.DocumentOptions | Format.RangeOptions) {
        if (!AtomFormat.formatRange(options)) {
            return Observable.empty<Text.FileChange[]>();
        }

        if (!this._syncExpression.evaluate(options.editor)) {
            return Observable.empty<Text.FileChange[]>();
        }

        const params: DocumentRangeFormattingParams = {
            textDocument: TextDocumentIdentifier.create(toUri(options.editor.getURI())),
            range: toRange(options.range),
            options: {
                // TODO...
                insertSpaces: true,
                tabSize: 4
            }
        };

        return Observable.fromPromise(this._client.sendRequest(DocumentRangeFormattingRequest.type, params))
            .map(fromTextEdits);
    }
}

class FormatDocumentProvider extends DisposableBase implements IFormatProvider {
    private _client: ILanguageProtocolClient;
    private _syncExpression: ISyncExpression;
    public constructor(client: ILanguageProtocolClient, syncExpression: ISyncExpression) {
        super();
        this._client = client;
        this._syncExpression = syncExpression;
    }

    public request(options: Format.DocumentOptions | Format.RangeOptions) {
        if (AtomFormat.formatRange(options)) {
            return Observable.empty<Text.FileChange[]>();
        }

        if (!this._syncExpression.evaluate(options.editor)) {
            return Observable.empty<Text.FileChange[]>();
        }

        const params: DocumentFormattingParams = {
            textDocument: TextDocumentIdentifier.create(toUri(options.editor.getURI())),
            options: {
                // TODO...
                insertSpaces: true,
                tabSize: 4
            }
        };

        return Observable.fromPromise(this._client.sendRequest(DocumentFormattingRequest.type, params))
            .map(fromTextEdits);
    }
}
