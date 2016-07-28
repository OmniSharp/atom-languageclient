/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { capability, inject } from '../services/_decorators';
import { ILanguageProtocolClient, ILinterService } from '../services/_public';
import { fromRange, fromUri } from './utils/convert';
import { Diagnostic, DiagnosticSeverity } from '../vscode-languageserver-types';
import { PublishDiagnosticsNotification, PublishDiagnosticsParams } from '../vscode-protocol';
import { Linter as LinterBase } from './Linter';

@capability
export class LanguageProtocolLinter extends LinterBase {
    private _client: ILanguageProtocolClient;
    constructor(
        @inject(ILanguageProtocolClient) client: ILanguageProtocolClient,
        @inject(ILinterService) linterService: ILinterService) {
        super(client.name, linterService);
        this._client = client;

        this.configure();
    }

    protected configure() {
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
