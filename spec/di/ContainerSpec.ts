/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { expect } from 'chai';
import {CompositeDisposable} from 'ts-disposables';
import * as constants from '../../src/constants';
import { A } from './fixtures/A';
import { B } from './fixtures/B';
import { C } from './fixtures/C';
import { Container } from '../../src/di/Container';
import * as L from './fixtures/L';

describe(Container.name, () => {
    it('should register a given folder', () => {
        const container = new Container();
        return container.registerFolder(__dirname, 'fixtures')
            .do(() => {
                const a = container.resolve(A);
                const b = container.resolve(B);
                const c = container.resolve(C);

                expect(a.a1()).to.eq('a');
                expect(b.a1()).to.eq('a');
                expect(b.b1()).to.eq('b');
                expect(c.a1()).to.eq('a');
                expect(c.b1()).to.eq('b');
                expect(c.c1()).to.eq('c');
            })
            .toPromise();
    });

    it('should register a set of exported classes from a single file', () => {
        const container = new Container();
        return container.registerFolder(__dirname, 'fixtures')
            .do(() => {
                const l1 = container.resolve(L.L1);
                const l2 = container.resolve(L.L2);
                const l3 = container.resolve(L.L3);

                expect(l1.a).to.be.eq(1);
                expect(l2.a).to.be.eq(1);
                expect(l3.a).to.be.eq(1);
            })
            .toPromise();
    });

    it('should register a list given a specific key', () => {
        const container = new Container();
        return container.registerFolder(__dirname, 'fixtures')
            .do(() => {
                const listOfAs = container.resolveAll<{ a: number }[]>('list');

                expect(listOfAs.length).to.be.eq(3);
                expect(_.find(listOfAs, { a: 1 })).to.be.deep.eq({ a: 1 });
                expect(_.find(listOfAs, { a: 2 })).to.be.deep.eq({ a: 2 });
                expect(_.find(listOfAs, { a: 3 })).to.be.deep.eq({ a: 3 });
            })
            .toPromise();
    });

    describe('capabilities', () => {
        const aKey = 1;
        const bKey = 2;

        @capability
        class CapabilityA {
            constructor( @inject(constants.languageprotocol) value: any) {

            }
            public a = 1;
        }

        @capability
        class CapabilityB {
            constructor( @inject(constants.languageprotocol) value: any) {

            }
            public a = 1;
        }

        @capability
        class CapabilityC {
            constructor( @inject(constants.omniclient) value: any) {

            }
            public a = 1;
        }

        it('should register and resolve each capability based on the correct key', () => {
            const container = new Container();
            container.autoRegister(CapabilityA);
            container.autoRegister(CapabilityB);
            container.autoRegister(CapabilityC);

            const result = <any>container.resolveCapabilities(constants.languageprotocol, { dispose() { /* */ } });
            const items = _.toArray(result._disposables);

            expect(_.find(items, item => item instanceof CapabilityA)).to.be.instanceOf(CapabilityA);
            expect(_.find(items, item => item instanceof CapabilityB)).to.be.instanceOf(CapabilityB);
            expect(_.find(items, item => item instanceof CapabilityC)).to.not.be.instanceOf(CapabilityC);
        });
    });
});
