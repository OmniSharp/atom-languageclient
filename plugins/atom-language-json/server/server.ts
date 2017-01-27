/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-for-in forin */
import { SymbolInformation } from 'vscode-languageserver-types';
import * as _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';
import { XHRResponse, configure as configureHttpRequests, getErrorStatusDescription, xhr } from 'request-light';
import * as URL from 'url';
import { JSONDocument, JSONSchema, LanguageSettings, getLanguageService } from 'vscode-json-languageservice';
import { IConnection, IPCMessageReader, IPCMessageWriter, InitializeParams, InitializeResult, NotificationType, TextDocument, TextDocuments, createConnection } from 'vscode-languageserver';
import { getDefaults } from './default-validations';
import { GlobPatternContribution } from './jsoncontributions/globPatternContribution';
import { getLanguageModelCache } from './languageModelCache';
import { ProjectJSONContribution } from './jsoncontributions/projectJSONContribution';
import URI from './utils/uri';

import { RequestType } from 'vscode-languageserver';

import * as nls from 'vscode-nls';
nls.config(process.env['VSCODE_NLS_CONFIG']);

interface ISchemaAssociations {
    [pattern: string]: string[];
}

export namespace SchemaAssociationNotification {
    export const type = new NotificationType<ISchemaAssociations, any>('json/schemaAssociations');
}

export namespace VSCodeContentRequest {
    export const type = new RequestType<string, string, any, any>('vscode/content');
}

// Create a connection for the server
let connection: IConnection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));

console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);

// Create a simple text document manager. The text document manager
// supports full document sync only
let documents: TextDocuments = new TextDocuments();
// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// After the server has started the client sends an initilize request. The server receives
// in the passed params the rootPath of the workspace plus the client capabilities.
let workspaceRoot: URI;
connection.onInitialize((params: InitializeParams): InitializeResult => {
    workspaceRoot = URI.parse(params.rootPath!);
    let snippetSupport = params.capabilities && params.capabilities.textDocument && params.capabilities.textDocument.completion && params.capabilities.textDocument.completion.completionItem && params.capabilities.textDocument.completion.completionItem.snippetSupport;
    return {
        capabilities: {
            // Tell the client that the server works in FULL text document sync mode
            textDocumentSync: documents.syncKind,
            completionProvider: snippetSupport ? { resolveProvider: true, triggerCharacters: ['"', ':'] } : undefined,
            hoverProvider: true,
            documentSymbolProvider: true,
            documentRangeFormattingProvider: !params.initializationOptions || params.initializationOptions['format.enable']
        }
    };
});

let workspaceContext = {
    resolveRelativePath: (relativePath: string, resource: string) => {
        return URL.resolve(resource, relativePath);
    }
};

let schemaRequestService = (uri: string): Thenable<string> => {
    if (_.startsWith(uri, 'file://')) {
        let fsPath = URI.parse(uri).fsPath;
        return new Promise<string>((c, e) => {
            fs.readFile(fsPath, 'UTF-8', (err, result) => {
                err ? e('') : c(result.toString());
            });
        });
    } else if (_.startsWith(uri, 'vscode://')) {
        return connection.sendRequest(VSCodeContentRequest.type, uri).then(responseText => {
            return responseText;
        }, error => {
            return error.message;
        });
    }
    if (uri.indexOf('//schema.management.azure.com/') !== -1) {
        connection.telemetry.logEvent({
            key: 'json.schema',
            value: {
                schemaURL: uri
            }
        });
    }
    return xhr({ url: uri, followRedirects: 5 }).then(response => {
        return response.responseText;
    }, (error: XHRResponse) => {
        return Promise.reject(error.responseText || getErrorStatusDescription(error.status) || error.toString());
    });
};

// create the JSON language service
let languageService = getLanguageService({
    schemaRequestService,
    workspaceContext,
    contributions: [
        new ProjectJSONContribution(),
        new GlobPatternContribution()
    ]
});

// The settings interface describes the server relevant settings part
interface Settings {
    json: {
        schemas: JSONSchemaSettings[];
    };
    http: {
        proxy: string;
        proxyStrictSSL: boolean;
    };
}

interface JSONSchemaSettings {
    fileMatch?: string[];
    url?: string;
    schema?: JSONSchema;
}

let jsonConfigurationSettings: JSONSchemaSettings[] | undefined = void 0;
let schemaAssociations: ISchemaAssociations | undefined = void 0;

// The settings have changed. Is send on server activation as well.
connection.onDidChangeConfiguration((change) => {
    var settings = <Settings>change.settings;
    configureHttpRequests(settings.http && settings.http.proxy, settings.http && settings.http.proxyStrictSSL);

    jsonConfigurationSettings = settings.json && settings.json.schemas;
    updateConfiguration();
});

// The jsonValidation extension configuration has changed
connection.onNotification(SchemaAssociationNotification.type, associations => {
    schemaAssociations = associations;
    updateConfiguration();
});

function updateConfiguration() {
    let languageSettings: LanguageSettings = {
        validate: true,
        allowComments: true,
        schemas: []
    };
    if (schemaAssociations) {
        for (var pattern in schemaAssociations) {
            let association = schemaAssociations[pattern];
            if (Array.isArray(association)) {
                association.forEach(uri => {
                    languageSettings.schemas!.push({ uri, fileMatch: [pattern] });
                });
            }
        }
    }
    if (jsonConfigurationSettings) {
        jsonConfigurationSettings.forEach(schema => {
            let uri = schema.url;
            if (!uri && schema.schema) {
                uri = schema.schema.id;
            }
            if (!uri && schema.fileMatch) {
                uri = 'vscode://schemas/custom/' + encodeURIComponent(schema.fileMatch.join('&'));
            }
            if (uri) {
                if (uri[0] === '.' && workspaceRoot) {
                    // workspace relative path
                    uri = URI.file(path.normalize(path.join(workspaceRoot.fsPath, uri))).toString();
                }
                languageSettings.schemas!.push({ uri, fileMatch: schema.fileMatch, schema: schema.schema });
            }
        });
    }
    languageService.configure(languageSettings);

    // Revalidate any open text documents
    documents.all().forEach(triggerValidation);
}

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent((change) => {
    triggerValidation(change.document);
});

// a document has closed: clear all diagnostics
documents.onDidClose(event => {
    cleanPendingValidation(event.document);
    connection.sendDiagnostics({ uri: event.document.uri, diagnostics: [] });
});

let pendingValidationRequests: { [uri: string]: NodeJS.Timer; } = {};
const validationDelayMs = 200;

function cleanPendingValidation(textDocument: TextDocument): void {
    let request = pendingValidationRequests[textDocument.uri];
    if (request) {
        clearTimeout(request);
        delete pendingValidationRequests[textDocument.uri];
    }
}

function triggerValidation(textDocument: TextDocument): void {
    cleanPendingValidation(textDocument);
    pendingValidationRequests[textDocument.uri] = setTimeout(() => {
        delete pendingValidationRequests[textDocument.uri];
        validateTextDocument(textDocument);
    }, validationDelayMs);
}

function validateTextDocument(textDocument: TextDocument): void {
    if (textDocument.getText().length === 0) {
        // ignore empty documents
        connection.sendDiagnostics({ uri: textDocument.uri, diagnostics: [] });
        return;
    }

    let jsonDocument = getJSONDocument(textDocument);
    languageService.doValidation(textDocument, jsonDocument).then(diagnostics => {
        // Send the computed diagnostics to VSCode.
        connection.sendDiagnostics({ uri: textDocument.uri, diagnostics: <any>diagnostics });
    });
}

connection.onDidChangeWatchedFiles((change) => {
    // Monitored files have changed in VSCode
    let hasChanges = false;
    change.changes.forEach(c => {
        if (languageService.resetSchema(c.uri)) {
            hasChanges = true;
        }
    });
    if (hasChanges) {
        documents.all().forEach(validateTextDocument);
    }
});

let jsonDocuments = getLanguageModelCache<JSONDocument>(10, 60, document => languageService.parseJSONDocument(document));

function getJSONDocument(document: TextDocument): JSONDocument {
    return jsonDocuments.get(document);
}

connection.onCompletion(textDocumentPosition => {
    let document = documents.get(textDocumentPosition.textDocument.uri);
    let jsonDocument = getJSONDocument(document);
    return <any>languageService.doComplete(document, textDocumentPosition.position, jsonDocument);
});

connection.onCompletionResolve(completionItem => {
    return languageService.doResolve(completionItem);
});

connection.onHover(textDocumentPositionParams => {
    let document = documents.get(textDocumentPositionParams.textDocument.uri);
    let jsonDocument = getJSONDocument(document);
    return languageService.doHover(document, textDocumentPositionParams.position, jsonDocument);
});

connection.onDocumentSymbol(documentSymbolParams => {
    let document = documents.get(documentSymbolParams.textDocument.uri);
    let jsonDocument = getJSONDocument(document);
    return <any>languageService.findDocumentSymbols(document, jsonDocument);
});

connection.onDocumentRangeFormatting(formatParams => {
    let document = documents.get(formatParams.textDocument.uri);
    return languageService.format(document, formatParams.range, formatParams.options);
});

// Listen on the connection
connection.listen();