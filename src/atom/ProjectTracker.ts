/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable, Subscriber } from 'rxjs';
import { IDisposable } from 'ts-disposables';

export interface IProjectProvider {
    getPaths: typeof atom.project.getPaths;
    onDidChangePaths: (callback: (paths: string[]) => void) => IDisposable;
}

export class ProjectProvider implements IProjectProvider {
    public getPaths() { return atom.project.getPaths(); }
    public onDidChangePaths(callback: (paths: string[]) => void) {
        return atom.project.onDidChangePaths(callback);
    }
}

@inject
export class ProjectTracker {
    private _projectPaths: string[] = [];
    private _projectsObserver: Subscriber<[string[], string[]]>;
    private _added: Observable<string>;
    private _removed: Observable<string>;

    public get added() { return this._added; }
    public get removed() { return this._removed; }

    public constructor(provider: ProjectProvider) {
        const base: Observable<[string[], string[]]> = Observable.create((observer: Subscriber<[string[], string[]]>) => {
            this._projectsObserver = observer;

            this._updatePaths(provider.getPaths());
            const disposable = provider.onDidChangePaths((paths) => {
                this._updatePaths(paths);
            });

            return () => disposable.dispose();
        })
            .share();

        this._added = Observable.merge(
            Observable.defer(() => Observable.from(this._projectPaths)),
            base.mergeMap(([added]) => added)
        );
        this._removed = base.mergeMap(([, removed]) => removed);
    }

    private _updatePaths(paths: string[]) {
        const addedPaths = _.difference(paths, this._projectPaths);
        const removedPaths = _.difference(this._projectPaths, paths);

        this._projectsObserver
            .next([addedPaths, removedPaths]);

        this._projectPaths = paths;
    }
}
