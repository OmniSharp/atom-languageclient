/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:export-name no-any no-invalid-this */

import { CompositeDisposable } from 'ts-disposables';
import { packageName } from '../src/constants';
import { AtomLanguageClientPackage } from '../src/AtomLanguageClientPackage';

export function setup() {
    let cd: CompositeDisposable;
    beforeEach(() => {
        cd = new CompositeDisposable();

        cd.add(
            () => {
                atom.packages.deactivatePackage(packageName);
            }
        );

        return atom.packages.activatePackage(packageName)
            .then(pack => {
                return (<AtomLanguageClientPackage>pack.mainModule)
                    .activated;
            });
    });
    afterEach(() => {
        cd.dispose();
    });
}
