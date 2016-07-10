/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { expect } from 'chai';
import { A } from './fixtures/A';
import { B } from './fixtures/B';
import { C } from './fixtures/C';
import { Container } from '../../src/di/Container';
import * as L from './fixtures/L';

describe(Container.name, () => {
    it('should register a given folder', () => {
        const container = new Container();
        container.registerFolder(__dirname, 'fixtures')
            .subscribe(() => {
                const a = container.resolve(A);
                const b = container.resolve(B);
                const c = container.resolve(C);

                expect(a.a1()).to.eq('a');
                expect(b.a1()).to.eq('a');
                expect(b.b1()).to.eq('b');
                expect(c.a1()).to.eq('a');
                expect(c.b1()).to.eq('b');
                expect(c.c1()).to.eq('c');
            });
    });

    it('should register a set of exported classes from a single file', () => {
        const container = new Container();
        container.registerFolder(__dirname, 'fixtures')
            .subscribe(() => {
                const l1 = container.resolve(L.L1);
                const l2 = container.resolve(L.L2);
                const l3 = container.resolve(L.L3);

                expect(l1.a).to.be.eq(1);
                expect(l2.a).to.be.eq(1);
                expect(l3.a).to.be.eq(1);
            });
    });

    it('should register a list given a specific key', () => {
        const container = new Container();
        container.registerFolder(__dirname, 'fixtures')
            .subscribe(() => {
                const listOfAs = container.resolveAll<{ a: number }[]>('list');

                expect(listOfAs.length).to.be.eq(3);
                expect(_.find(listOfAs, { a: 1 })).to.be.deep.eq({ a: 1 });
                expect(_.find(listOfAs, { a: 2 })).to.be.deep.eq({ a: 2 });
                expect(_.find(listOfAs, { a: 3 })).to.be.deep.eq({ a: 3 });
            });
    });
});
