/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Disposable, IDisposable } from 'ts-disposables';
import { FeatureServiceBase, IFeatureService } from './_FeatureServiceBase';
import { AtomLanguageClientConfig } from '../AtomLanguageClientConfig';

export abstract class ProviderServiceBase<TProvider extends { request: (options: TRequest) => TResponse; } & IDisposable, TRequest, TResponse, TAggregateResponse> extends FeatureServiceBase {
    private _providers: Set<TProvider> = new Set<TProvider>();
    private _invoke: (options: TRequest) => TAggregateResponse;

    constructor(ctor: new <T extends ProviderServiceBase<TProvider, TRequest, TResponse, TAggregateResponse>>(...args: any[]) => T, packageConfig: AtomLanguageClientConfig, descriptor: IFeatureService) {
        super(ctor, packageConfig, descriptor);

        this._disposable.add(
            Disposable.create(() => {
                this._providers.forEach(x => x.dispose());
                this._providers.clear();
            })
        );
    }

    protected abstract createInvoke(callbacks: ((options: TRequest) => TResponse)[]): (options: TRequest) => TAggregateResponse;

    protected invoke(options: TRequest) {
        return this._invoke(options);
    }

    protected get hasProviders() { return !!this._providers.size; }

    private _computeInvoke() {
        const callbacks = _.map(_.toArray(this._providers), provider => {
            return (options: TRequest) => provider.request(options);
        });
        this._invoke = this.createInvoke(callbacks);
    }

    public registerProvider(provider: TProvider) {
        this._providers.add(provider);
        this._computeInvoke();

        return Disposable.create(() => {
            this._providers.delete(provider);
            this._computeInvoke();
        });
    }
}
