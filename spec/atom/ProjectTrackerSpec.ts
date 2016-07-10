/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable, Scheduler } from 'rxjs';
import { expect } from 'chai';
import { ProjectTracker } from '../../src/atom/ProjectTracker';

describe(ProjectTracker.name, () => {
    it('should report all values when subscribed', () => {
        const data = ['a', 'b', 'c'];
        const tracker = new ProjectTracker({
            getPaths() { return data; },
            onDidChangePaths(cb) { return { dispose() { /* */ } }; }
        });

        return tracker.added
            .take(3)
            .toArray()
            .toPromise()
            .then(values => {
                expect(values).to.deep.eq(data.concat());
            });
    });

    it('should re-report all values when subscribed a second time', () => {
        const data = ['a', 'b', 'c'];
        const tracker = new ProjectTracker({
            getPaths() { return data; },
            onDidChangePaths(cb) { return { dispose() { /* */ } }; }
        });

        return Observable.forkJoin(
            tracker.added.take(3).toArray(),
            tracker.added.delay(10).take(3).toArray(),
            tracker.added.delay(5).take(3).toArray(),
        ).toPromise()
            .then(values => {
                expect(values[0]).to.deep.eq(values[1]);
                expect(values[1]).to.deep.eq(values[2]);
                expect(values[2]).to.deep.eq(values[0]);
            });
    });

    it('should add new paths', () => {
        const data = ['a', 'b', 'c'];
        const data2 = ['a', 'b', 'c', 'd'];
        let callback: (paths: string[]) => void;
        const tracker = new ProjectTracker({
            getPaths() { return data; },
            onDidChangePaths(cb) {
                callback = cb;
                return { dispose() { /* */ } };
            }
        });

        return Observable.merge(
            tracker.added
                .take(3)
                .subscribeOn(Scheduler.async)
                .do({
                    complete() {
                        callback(data2);
                    }
                }),
            tracker.added
                .skip(3)
                .take(1)
        )
            .take(4)
            .toArray()
            .toPromise()
            .then(values => {
                expect(values).to.deep.eq(data2.concat());
            });
    });

    it('should remove old paths', () => {
        const data = ['a', 'b', 'c'];
        const data2 = ['a', 'b'];
        let callback: (paths: string[]) => void;
        const tracker = new ProjectTracker({
            getPaths() { return data; },
            onDidChangePaths(cb) {
                callback = cb;
                return { dispose() { /* */ } };
            }
        });

        return Observable.merge(
            tracker.removed
                .take(1),
            tracker.added
                .take(3)
                .subscribeOn(Scheduler.async)
                .do({
                    complete() {
                        callback(data2);
                    }
                })
        )
            .take(4)
            .toArray()
            .toPromise()
            .then(values => {
                expect(values).to.deep.eq(['a', 'b', 'c', 'c']);
            });
    });

    it('should add and remove paths', () => {
        const data = ['a', 'b', 'c'];
        const data2 = ['a', 'b', 'e'];
        let callback: (paths: string[]) => void;
        const tracker = new ProjectTracker({
            getPaths() { return data; },
            onDidChangePaths(cb) {
                callback = cb;
                return { dispose() { /* */ } };
            }
        });

        return Observable.merge(
            tracker.removed
                .take(1),
            tracker.added
                .skip(3)
                .take(1),
            tracker.added
                .take(3)
                .subscribeOn(Scheduler.async)
                .do({
                    complete() {
                        callback(data2);
                    }
                })
        )
            .take(5)
            .toArray()
            .toPromise()
            .then(values => {
                expect(values).to.deep.eq(['a', 'b', 'c', 'c', 'e']);
            });
    });

});
