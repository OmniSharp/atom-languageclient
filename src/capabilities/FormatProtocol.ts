/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Observable } from 'rxjs';
import { Format, IFormatProvider, IFormatService, ILanguageProtocolClient, ISyncExpression, Text } from 'atom-languageservices';
import { capability, inject } from 'atom-languageservices/decorators';
import { DocumentFormattingRequest, DocumentRangeFormattingRequest } from 'atom-languageservices/protocol';
import { DocumentFormattingParams, DocumentRangeFormattingParams, TextDocumentIdentifier } from 'atom-languageservices/types';
import * as toUri from 'file-url';
import { DisposableBase } from 'ts-disposables';
import { fromTextEdits, toRange } from './utils/convert';

@capability((capabilities) => !!capabilities.documentFormattingProvider || !!capabilities.documentRangeFormattingProvider)
export class FormatProtocol extends DisposableBase {
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

    public request(options: Format.IRequest) {
        if (!Format.formatHasRange(options)) {
            return Observable.empty<Text.IFileChange[]>();
        }

        if (!this._syncExpression.evaluate(options.editor)) {
            return Observable.empty<Text.IFileChange[]>();
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

        return this._client.sendRequest(DocumentRangeFormattingRequest.type, params)
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

    public request(options: Format.IRequest) {
        if (Format.formatHasRange(options)) {
            return Observable.empty<Text.IFileChange[]>();
        }

        if (!this._syncExpression.evaluate(options.editor)) {
            return Observable.empty<Text.IFileChange[]>();
        }

        const params: DocumentFormattingParams = {
            textDocument: TextDocumentIdentifier.create(toUri(options.editor.getURI())),
            options: {
                // TODO...
                insertSpaces: true,
                tabSize: 4
            }
        };

        return this._client.sendRequest(DocumentFormattingRequest.type, params)
            .map(fromTextEdits);
    }
}
