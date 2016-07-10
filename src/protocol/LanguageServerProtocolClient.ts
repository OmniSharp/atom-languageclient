/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { DisposableBase } from 'ts-disposables';
import { LanguageClient, LanguageClientOptions, ServerOptions, SettingMonitor, TransportKind } from 'vscode-languageclient';

export class LanguageServerProtocolClient extends DisposableBase {
    constructor() {
        super();

        // The server is implemented in node
        const serverModule = context.asAbsolutePath(path.join('server', 'server.js'));
        // The debug options for the server
        const debugOptions = { execArgv: ['--nolazy', '--debug=6004'] };

        // If the extension is launched in debug mode then the debug server options are used
        // Otherwise the run options are used
        const serverOptions: ServerOptions = {
            run: { module: serverModule, transport: TransportKind.ipc },
            debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
        }

        // Options to control the language client
        const clientOptions: LanguageClientOptions = {
            // Register the server for plain text documents
            documentSelector: ['plaintext'],
            synchronize: {
                // Synchronize the setting section 'languageServerExample' to the server
                configurationSection: 'languageServerExample',
                // Notify the server about file changes to '.clientrc files contain in the workspace
                fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
            }
        }

        // Create the language client and start the client.
        const disposable = new LanguageClient('Language Server Example', serverOptions, clientOptions).start();

        // Push the disposable to the context's subscriptions so that the
        // client can be deactivated on extension deactivation
        context.subscriptions.push(disposable);
    }
}
