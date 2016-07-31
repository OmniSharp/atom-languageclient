/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { ILanguageProtocolClient, ILinterService, Linter } from 'atom-languageservices';
import { capability, inject } from 'atom-languageservices/decorators';
import { PublishDiagnosticsNotification } from 'atom-languageservices/protocol';
import { Diagnostic, DiagnosticSeverity, PublishDiagnosticsParams } from 'atom-languageservices/types';
import { DisposableBase } from 'ts-disposables';
import { fromRange, fromUri } from './utils/convert';

@capability
export class LinterProtocol extends DisposableBase {
    private _client: ILanguageProtocolClient;
    private _linterService: ILinterService;
    private _linter: Linter.IndieLinter;
    private _diagnostics = new Map<string, Linter.Message[]>();

    constructor(
        @inject(ILanguageProtocolClient) client: ILanguageProtocolClient,
        @inject(ILinterService) linterService: ILinterService) {
        super();
        this._linterService = linterService;
        this._linter = this._linterService.getLinter(client.name);
        this._disposable.add(this._linter);
        this._client = client;

        this._configure();
    }

    public setMessages(path: string, messages: Linter.Message[]) {
        this._diagnostics.set(path, messages);
        this.updateMessages();
    }

    public updateMessages = _.throttle(
        () => {
            this._linter.setMessages(_.flatten(_.toArray(this._diagnostics.values())));
        },
        100,
        { trailing: true, leading: true });

    private _configure() {
        this._client.onNotification(PublishDiagnosticsNotification.type, _.bind(this._recieveDiagnostics, this));
    }

    private _recieveDiagnostics({uri, diagnostics}: PublishDiagnosticsParams) {
        uri = fromUri(uri) || uri;
        this.setMessages(uri, this._fromDiagnostics(uri, diagnostics));
    }

    private _fromDiagnostics(path: string, diagnostics: Diagnostic[]): Linter.Message[] {
        return _.map(diagnostics, _.bind(this._fromDiagnostic, this, path));
    }

    private _fromDiagnostic(path: string, diagnostic: Diagnostic): Linter.TextMessage {
        return {
            filePath: path,
            type: this._fromDiagnosticSeverity(diagnostic.severity),
            text: diagnostic.message,
            range: fromRange(diagnostic.range),
            severity: this._fromDiagnosticSeverity(diagnostic.severity),
            code: diagnostic.code,
            name: diagnostic.source
        };
    }

    private _fromDiagnosticSeverity(value: number | undefined): ('error' | 'warning' | 'info') {
        switch (value) {
            case DiagnosticSeverity.Error:
                return 'error';
            case DiagnosticSeverity.Warning:
                return 'warning';
            case DiagnosticSeverity.Information:
            case DiagnosticSeverity.Hint:
                return 'info';
            default:
                return 'error';
        }
    }
}
