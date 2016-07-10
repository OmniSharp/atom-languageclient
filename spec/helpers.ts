/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:export-name no-any no-reserved-keywords no-invalid-this */

import { CompositeDisposable } from 'ts-disposables';
import { packageName } from '../src/strings';
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
                return (<AtomLanguageClientPackage>pack.mainModule)['provide-atom-language-client']()
                    .activated
                    .do({ next: () => console.log('next') })
                    .take(1)
                    .toPromise();
            });
    });
    afterEach(() => {
        cd.dispose();
    });
}

/*export function setupFeature(features: string[], unitTestMode = true) {
    let cd: CompositeDisposable;
    beforeEach(function() {
        cd = new CompositeDisposable();
        SolutionManager._unitTestMode_ = unitTestMode;
        SolutionManager._kick_in_the_pants_ = true;

        atom.config.set("omnisharp-atom:feature-white-list", true);
        atom.config.set("omnisharp-atom:feature-list", features);

        return atom.packages.activatePackage("language-csharp")
            .then(() => atom.packages.activatePackage("omnisharp-atom"))
            .then((pack: Atom.Package) => pack.mainModule._activated.delay(200).toPromise());
    });

    afterEach(function() {
        atom.packages.deactivatePackage("omnisharp-atom");
        atom.packages.deactivatePackage("language-csharp");
        atom.config.set("omnisharp-atom:feature-white-list", undefined);
        atom.config.set("omnisharp-atom:feature-list", undefined);
        SolutionManager._unitTestMode_ = false;
        SolutionManager._kick_in_the_pants_ = false;
        cd.dispose();
    });
}
*/
