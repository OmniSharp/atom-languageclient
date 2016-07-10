/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import _ from 'lodash';
import Package from '~atom/src/atom/package';

export interface IAtomPackages {
    activatePackages(): PromiseLike<Package[]>;
    activatePackage(name: string): PromiseLike<Package>;
    deactivatePackage(name: string): Package;
    deactivatePackages(): void;
}

export const packages = (() => {
    return _.extend(atom.packages, <IAtomPackages>{});
})();
