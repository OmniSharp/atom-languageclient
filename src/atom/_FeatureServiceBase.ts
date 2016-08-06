/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Disposable, DisposableBase, IDisposable } from 'ts-disposables';
import { AtomLanguageClientConfig } from '../AtomLanguageClientConfig';

export interface IFeatureService {
    description: string;
    default: boolean;
}

export abstract class FeatureServiceBase extends DisposableBase {
    constructor(ctor: new <T extends FeatureServiceBase>(...args: any[]) => T, packageConfig: AtomLanguageClientConfig, descriptor: IFeatureService) {
        super();

        const name = _.startCase(ctor.name);
        const setting = _.assign({ type: <'boolean'>'boolean', title: name }, descriptor);

        packageConfig.add(name, setting);
    }

    protected abstract onEnabled(): IDisposable;
}
