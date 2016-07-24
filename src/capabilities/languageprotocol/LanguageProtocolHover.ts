/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import * as toUri from 'file-url';
import { DisposableBase } from 'ts-disposables';
import { capability, inject } from '../../services/_decorators';
import { IHoverProvider, IHoverService, ILanguageProtocolClient, ISyncExpression } from '../../services/_public';
import { Hover, MarkedString, Position, TextDocumentIdentifier } from '../../vscode-languageserver-types';
import { HoverRequest } from '../../vscode-protocol';

@capability
export class LanguageProtocolHover extends DisposableBase {
    private _client: ILanguageProtocolClient;
    private _syncExpression: ISyncExpression;
    private _hoverService: IHoverService;
    constructor(
        @inject(ILanguageProtocolClient) client: ILanguageProtocolClient,
        @inject(IHoverService) finderService: IHoverService,
        @inject(ISyncExpression) syncExpression: ISyncExpression
    ) {
        super();
        this._client = client;
        this._hoverService = finderService;
        this._syncExpression = syncExpression;
        if (!client.capabilities.hoverProvider) {
            return;
        }

        // TODO: Handle trigger characters
        const service = new HoverProvider(client, syncExpression);
        this._disposable.add(service);
        this._hoverService.registerProvider(service);
    }
}

class HoverProvider extends DisposableBase implements IHoverProvider {
    private _client: ILanguageProtocolClient;
    private _syncExpression: ISyncExpression;
    public constructor(
        client: ILanguageProtocolClient,
        syncExpression: ISyncExpression) {
        super();
        this._client = client;
        this._syncExpression = syncExpression;
    }

    public request(options: Hover.RequestOptions) {
        if (!this._syncExpression.evaluate(options.editor)) {
            return;
        }

        return Observable.fromPromise(
            this._client.sendRequest(HoverRequest.type, {
                textDocument: TextDocumentIdentifier.create(toUri(options.editor.getURI())),
                position: Position.create(options.location.row, options.location.column)
            })
        ).map(result => {
            return this._makeSymbol(result);
        })
        .filter(x => !!x);
    }

    private _getString(markedString: MarkedString) {
        if (_.isString(markedString)) {
            return markedString;
        } else {
            if (markedString.language === 'string') {
                return markedString.value;
            }
            return `[${markedString.language}]: ${markedString.value}`;
        }
    }

    private _makeSymbol(s: Hover): Hover.Symbol {
        if (!s) {
            return undefined!;
        }
        let text: string;
        let description: string[] = [];
        if (_.isArray(s.contents)) {
            const values = _.map(s.contents, content => this._getString(content));
            text = values[0];
            description = _.drop(values, 1);
        } else {
            text = this._getString(s.contents);
        }
        // TODO: Icon html
        return { text, description: description.join('<br/>') };
    }
}
