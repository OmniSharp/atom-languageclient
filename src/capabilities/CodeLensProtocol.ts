/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { CodeLens, ICodeLensProvider, ICodeLensService, ILanguageProtocolClient, ISyncExpression } from 'atom-languageservices';
import { capability, inject } from 'atom-languageservices/decorators';
import { CodeLensRequest, CodeLensResolveRequest } from 'atom-languageservices/protocol';
import { CodeLens as TCodeLens, MarkedString, TextDocumentIdentifier } from 'atom-languageservices/types';
import * as toUri from 'file-url';
import { DisposableBase } from 'ts-disposables';
import { fromRange, toRange } from './utils/convert';

@capability((capabilities) => !!capabilities.codeLensProvider)
export class CodeLensProtocol extends DisposableBase {
    private _client: ILanguageProtocolClient;
    private _syncExpression: ISyncExpression;
    private _codeLensService: ICodeLensService;
    constructor(
        @inject(ILanguageProtocolClient) client: ILanguageProtocolClient,
        @inject(ICodeLensService) finderService: ICodeLensService,
        @inject(ISyncExpression) syncExpression: ISyncExpression
    ) {
        super();
        this._client = client;
        this._codeLensService = finderService;
        this._syncExpression = syncExpression;

        // TODO: Handle trigger characters
        const service = new CodeLensProvider(client, syncExpression);
        this._disposable.add(service);
        this._codeLensService.registerProvider(service);
    }
}

class CodeLensProvider extends DisposableBase implements ICodeLensProvider {
    private _client: ILanguageProtocolClient;
    private _syncExpression: ISyncExpression;
    private _doResolve: boolean;
    public constructor(
        client: ILanguageProtocolClient,
        syncExpression: ISyncExpression) {
        super();
        this._client = client;
        this._syncExpression = syncExpression;

        if (this._client.capabilities.codeLensProvider!.resolveProvider) {
            this._doResolve = !!this._client.capabilities.codeLensProvider!.resolveProvider;
        }
    }

    public request(options: CodeLens.IRequest) {
        if (!this._syncExpression.evaluate(options.editor)) {
            return Observable.empty<CodeLens.IResponse[]>();
        }

        return this._client.sendRequest(CodeLensRequest.type, {
            textDocument: TextDocumentIdentifier.create(toUri(options.editor.getURI()))
        }).map(results => {
            return _.map(results, _.bind(this._createResponse, this));
        });
    }

    private _createResponse(context: TCodeLens) {
        return new CodeLensResponse(context, (value: CodeLensResponse) => this.resolve(value));
    }

    public resolve(codeLens: CodeLens.IResponse) {
        if (!this._doResolve) {
            return Observable.of(codeLens);
        }

        return this._client.sendRequest(CodeLensResolveRequest.type, {
            command: codeLens.command,
            data: codeLens.data,
            range: toRange(codeLens.range)
        }).map(result => {
            codeLens.command = result.command;
            codeLens.data = result.data;
            return codeLens;
        });
    }
}

class CodeLensResponse implements CodeLens.IResponse {
    private _resolved = false;
    private _resolve: (context: CodeLens.IResponse) => Observable<CodeLens.IResponse>;
    constructor(context: TCodeLens, resolve: (context: CodeLens.IResponse) => Observable<CodeLens.IResponse>) {
        this.command = context.command;
        this.data = context.data;
        this.range = fromRange(context.range);
        this._resolve = resolve;
    }

    public command: CodeLens.ICommand | undefined;
    public data: any;
    public range: TextBuffer.Range;

    public resolve(): Observable<CodeLens.IResponse> {
        if (this._resolved) {
            return Observable.of<CodeLens.IResponse>(this);
        }
        return this._resolve(this)
            .do(() => { this._resolved = true; });
    }
}
