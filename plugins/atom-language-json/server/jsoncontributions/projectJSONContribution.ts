/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { XHRResponse, getErrorStatusDescription, xhr } from 'request-light';
import { CompletionsCollector, JSONPath, JSONWorkerContribution } from 'vscode-json-languageservice';
import { CompletionItem, CompletionItemKind, MarkedString } from 'vscode-languageserver-types';

const FEED_INDEX_URL = 'https://api.nuget.org/v3/index.json';
const LIMIT = 30;
const RESOLVE_ID = 'ProjectJSONContribution-';

const CACHE_EXPIRY = 1000 * 60 * 5; // 5 minutes

interface NugetServices {
    'SearchQueryService'?: string;
    'SearchAutocompleteService'?: string;
    'PackageBaseAddress/3.0.0'?: string;
    [key: string]: string | undefined;
}

export class ProjectJSONContribution implements JSONWorkerContribution {

    private cachedProjects: { [id: string]: { version: string, description: string, time: number } } = {};
    private cacheSize: number = 0;
    private nugetIndexPromise: Thenable<NugetServices>;

    constructor() {
    }

    private _isProjectJSONFile(resource: string): boolean {
        return _.endsWith(resource, '/project.json');
    }

    private _completeWithCache(id: string, item: CompletionItem): boolean {
        const entry = this.cachedProjects[id];
        if (entry) {
            if (new Date().getTime() - entry.time > CACHE_EXPIRY) {
                delete this.cachedProjects[id];
                this.cacheSize--;
                return false;
            }
            item.detail = entry.version;
            item.documentation = entry.description;
            item.insertText = item.insertText!.replace(/\{\{\}\}/, '{{' + entry.version + '}}');
            return true;
        }
        return false;
    }

    private _addCached(id: string, version: string, description: string) {
        this.cachedProjects[id] = { version, description, time: new Date().getTime() };
        this.cacheSize++;
        if (this.cacheSize > 50) {
            const currentTime = new Date().getTime();
            for (let id in this.cachedProjects) {
                const entry = this.cachedProjects[id];
                if (currentTime - entry.time > CACHE_EXPIRY) {
                    delete this.cachedProjects[id];
                    this.cacheSize--;
                }
            }
        }
    }

    private _getNugetIndex(): Thenable<NugetServices> {
        if (!this.nugetIndexPromise) {
            this.nugetIndexPromise = this.makeJSONRequest<any>(FEED_INDEX_URL).then(indexContent => {
                let services: NugetServices = {};
                if (indexContent && Array.isArray(indexContent.resources)) {
                    let resources = <any[]>indexContent.resources;
                    for (let i = resources.length - 1; i >= 0; i--) {
                        let type = resources[i]['@type'];
                        let id = resources[i]['@id'];
                        if (type && id) {
                            services[type] = id;
                        }
                    }
                }
                return services;
            });
        }
        return this.nugetIndexPromise;
    }

    private _getNugetService(serviceType: string): Thenable<string> {
        return this._getNugetIndex().then(services => {
            const serviceURL = services[serviceType];
            if (!serviceURL) {
                return Promise.reject<string>(`NuGet index document is missing service ${serviceType}`);
            }
            return serviceURL;
        });
    }

    public collectDefaultCompletions(resource: string, result: CompletionsCollector): Thenable<any> {
        if (this._isProjectJSONFile(resource)) {
            const defaultValue = {
                'version': '{{1.0.0-*}}',
                'dependencies': {},
                'frameworks': {
                    'dnx451': {},
                    'dnxcore50': {}
                }
            };
            result.add({ kind: CompletionItemKind.Class, label: 'Default project.json', insertText: JSON.stringify(defaultValue, null, '\t'), documentation: '' });
        }
        return null!;
    }

    private makeJSONRequest<T>(url: string): Thenable<T> {
        return xhr({
            url: url
        }).then(success => {
            if (success.status === 200) {
                try {
                    return <T>JSON.parse(success.responseText);
                } catch (e) {
                    return Promise.reject<T>(`'{0} is not a valid JSON document', url`);
                }
            }
            return Promise.reject<T>(`Request to ${url} failed: ${success.responseText}`);
        }, (error: XHRResponse) => {
            return Promise.reject<T>(`Request to ${url} failed: ${getErrorStatusDescription(error.status)}`);
        });
    }

    public collectPropertyCompletions(resource: string, location: JSONPath, currentWord: string, addValue: boolean, isLast: boolean, result: CompletionsCollector): Thenable<any> {
        if (this._isProjectJSONFile(resource) && (matches(location, ['dependencies']) || matches(location, ['frameworks', '*', 'dependencies']) || matches(location, ['frameworks', '*', 'frameworkAssemblies']))) {

            return this._getNugetService('SearchAutocompleteService').then(service => {
                let queryUrl: string;
                if (currentWord.length > 0) {
                    queryUrl = service + '?q=' + encodeURIComponent(currentWord) + '&take=' + LIMIT;
                } else {
                    queryUrl = service + '?take=' + LIMIT;
                }
                return this.makeJSONRequest<any>(queryUrl).then(resultObj => {
                    if (Array.isArray(resultObj.data)) {
                        let results = <any[]>resultObj.data;
                        for (let i = 0; i < results.length; i++) {
                            let name = results[i];
                            let insertText = JSON.stringify(name);
                            if (addValue) {
                                insertText += ': "{{}}"';
                                if (!isLast) {
                                    insertText += ',';
                                }
                            }
                            let item: CompletionItem = { kind: CompletionItemKind.Property, label: name, insertText: insertText };
                            if (!this._completeWithCache(name, item)) {
                                item.data = RESOLVE_ID + name;
                            }
                            result.add(item);
                        }
                        if (results.length === LIMIT) {
                            result.setAsIncomplete();
                        }
                    }
                }, error => {
                    result.error(error);
                });
            }, error => {
                result.error(error);
            });
        };
        return null!;
    }

    public collectValueCompletions(resource: string, location: JSONPath, currentKey: string, result: CompletionsCollector): Thenable<any> {
        if (this._isProjectJSONFile(resource) && (matches(location, ['dependencies']) || matches(location, ['frameworks', '*', 'dependencies']) || matches(location, ['frameworks', '*', 'frameworkAssemblies']))) {
            return this._getNugetService('PackageBaseAddress/3.0.0').then(service => {
                let queryUrl = service + currentKey + '/index.json';
                return this.makeJSONRequest<any>(queryUrl).then(obj => {
                    if (Array.isArray(obj.versions)) {
                        let results = <any[]>obj.versions;
                        for (let i = 0; i < results.length; i++) {
                            let curr = results[i];
                            let name = JSON.stringify(curr);
                            let label = name;
                            let documentation = '';
                            result.add({ kind: CompletionItemKind.Class, label: label, insertText: name, documentation: documentation });
                        }
                        if (results.length === LIMIT) {
                            result.setAsIncomplete();
                        }
                    }
                }, error => {
                    result.error(error);
                });
            }, error => {
                result.error(error);
            });
        }
        return null!;
    }

    public getInfoContribution(resource: string, location: JSONPath): Thenable<MarkedString[]> {
        if (this._isProjectJSONFile(resource) && (matches(location, ['dependencies', '*']) || matches(location, ['frameworks', '*', 'dependencies', '*']) || matches(location, ['frameworks', '*', 'frameworkAssemblies', '*']))) {
            let pack = <string>location[location.length - 1];

            return this._getNugetService('SearchQueryService')
                .then(service => {
                    let queryUrl = service + '?q=' + encodeURIComponent(pack) + '&take=' + 5;
                    return this.makeJSONRequest<any>(queryUrl)
                        .then(resultObj => {
                            let htmlContent: MarkedString[] = [];
                            htmlContent.push(pack);
                            if (Array.isArray(resultObj.data)) {
                                let results = <any[]>resultObj.data;
                                for (let i = 0; i < results.length; i++) {
                                    let res = results[i];
                                    this._addCached(res.id, res.version, res.description);
                                    if (res.id === pack) {
                                        if (res.description) {
                                            htmlContent.push({ language: 'string', value: res.description });
                                        }
                                        if (res.version) {
                                            htmlContent.push({ language: 'string', value: `Latest version: ${res.version}` });
                                        }
                                        break;
                                    }
                                }
                            }
                            return htmlContent;
                        }, (error) => {
                            return error;
                        });
                }, (error) => {
                    return error;
                });
        }
        return null!;
    }

    public resolveSuggestion(item: CompletionItem): Thenable<CompletionItem | null> {
        if (item.data && _.startsWith(item.data, RESOLVE_ID)) {
            let pack = item.data.substring(RESOLVE_ID.length);
            if (this._completeWithCache(pack, item)) {
                return Promise.resolve(item);
            }
            return this._getNugetService('SearchQueryService')
                .then(service => {
                    let queryUrl = service + '?q=' + encodeURIComponent(pack) + '&take=' + 10;
                    var result = this.makeJSONRequest<any>(queryUrl)
                        .then(resultObj => {
                            let itemResolved = false;
                            if (Array.isArray(resultObj.data)) {
                                let results = <any[]>resultObj.data;
                                for (let i = 0; i < results.length; i++) {
                                    let curr = results[i];
                                    this._addCached(curr.id, curr.version, curr.description);
                                    if (curr.id === pack) {
                                        this._completeWithCache(pack, item);
                                        itemResolved = true;
                                    }
                                }
                            }
                            return itemResolved ? item : <CompletionItem | null>null;
                        });
                    return <any>result;
                });
        };
        return null!;
    }
}

function matches(segments: JSONPath, pattern: string[]) {
    let k = 0;
    for (let i = 0; k < pattern.length && i < segments.length; i++) {
        if (pattern[k] === segments[i] || pattern[k] === '*') {
            k++;
        } else if (pattern[k] !== '**') {
            return false;
        }
    }
    return k === pattern.length;
}
