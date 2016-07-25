/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Disposable, DisposableBase, IDisposable } from 'ts-disposables';

export abstract class ProviderServiceBase<TProvider extends { request: (options: TRequest) => TResponse; } & IDisposable, TRequest, TResponse, TAggregateResponse> extends DisposableBase {
    private _providers: Set<TProvider> = new Set<TProvider>();
    private _invoke: (options: TRequest) => TAggregateResponse;

    constructor() {
        super();
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
