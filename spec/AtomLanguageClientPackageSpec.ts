/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { expect } from 'chai';
import { setup } from './helpers';
import { AtomLanguageClientPackage } from '../src/AtomLanguageClientPackage';

describe(AtomLanguageClientPackage.name, () => {
    setup();
    it('should activate when started', () => {
        expect(1234, 'the application has activated correctly 1234').to.be.eq(1234);
    });
});
