/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-for-in */
import { TextDocument } from 'vscode-languageserver';
export interface LanguageModelCache<T> {
    get(document: TextDocument): T;
    onDocumentRemoved(document: TextDocument): void;
    dispose(): void;
}

export function getLanguageModelCache<T>(maxEntries: number, cleanupIntervalTimeInSec: number, parse: (document: TextDocument) => T): LanguageModelCache<T> {
    let languageModels: { [uri: string]: { version: number, languageId: string, cTime: number, languageModel: T } } = {};
    let nModels = 0;

    let cleanupInterval: NodeJS.Timer | void = void 0;
    if (cleanupIntervalTimeInSec > 0) {
        cleanupInterval = setInterval(
            () => {
                const cutoffTime = Date.now() - cleanupIntervalTimeInSec * 1000;
                const uris = Object.keys(languageModels);
                for (let uri of uris) {
                    const languageModelInfo = languageModels[uri];
                    if (languageModelInfo.cTime < cutoffTime) {
                        delete languageModels[uri];
                        nModels--;
                    }
                }
            },
            cleanupIntervalTimeInSec * 1000);
    }

    return {
        get(document: TextDocument): T {
            const version = document.version;
            const languageId = document.languageId;
            const languageModelInfo = languageModels[document.uri];
            if (languageModelInfo && languageModelInfo.version === version && languageModelInfo.languageId === languageId) {
                languageModelInfo.cTime = Date.now();
                return languageModelInfo.languageModel;
            }
            const languageModel = parse(document);
            languageModels[document.uri] = { languageModel, version, languageId, cTime: Date.now() };
            if (!languageModelInfo) {
                nModels++;
            }

            if (nModels === maxEntries) {
                let oldestTime = Number.MAX_VALUE;
                let oldestUri: any = null;
                for (let uri in languageModels) {
                    let languageModelInfo = languageModels[uri];
                    if (languageModelInfo.cTime < oldestTime) {
                        oldestUri = uri;
                        oldestTime = languageModelInfo.cTime;
                    }
                }
                if (oldestUri) {
                    delete languageModels[oldestUri];
                    nModels--;
                }
            }
            return languageModel;

        },
        onDocumentRemoved(document: TextDocument) {
            const uri = document.uri;
            if (languageModels[uri]) {
                delete languageModels[uri];
                nModels--;
            }
        },
        dispose() {
            if (cleanupInterval !== undefined) {
                clearInterval(cleanupInterval);
                cleanupInterval = void 0;
                languageModels = {};
                nModels = 0;
            }
        }
    };
}
