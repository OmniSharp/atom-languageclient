"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
var _ = require('lodash');
// import { Observable } from 'rxjs';
var atom_languageservices_1 = require('atom-languageservices');
var ts_disposables_1 = require('ts-disposables');
var AtomTextEditorSource_1 = require('../atom/AtomTextEditorSource');
var Connection_1 = require('../protocol/Connection');
var LanguageProtocolClient_1 = require('../protocol/LanguageProtocolClient');
var SyncExpression_1 = require('./SyncExpression');
/**
 * Takes in all the different languages provided by other packages and configures them.
 */
var LanguageProvider = (function (_super) {
    __extends(LanguageProvider, _super);
    function LanguageProvider(container, activated) {
        var _this = this;
        _super.call(this);
        this._container = container;
        this._connections = new Map();
        this._activatedPromise = activated;
        activated.then(function () { return _this._activated = true; });
    }
    LanguageProvider.prototype.add = function (provider) {
        var _this = this;
        if (!this._activated) {
            this._activatedPromise.then(function () { return _this.add(provider); });
            return;
        }
        if (!this._atomTextEditorSource) {
            this._atomTextEditorSource = this._container.resolve(AtomTextEditorSource_1.AtomTextEditorSource);
        }
        if (!this._connections.has(provider)) {
            this._connections.set(provider, new Set());
        }
        var connections = this._connections.get(provider);
        var syncExpression = SyncExpression_1.SyncExpression.create(provider.clientOptions);
        this._atomTextEditorSource.observeTextEditors
            .filter(function (editor) { return syncExpression.evaluate(editor); })
            .take(1)
            .toPromise()
            .then(function () {
            return _this._createClient(provider, syncExpression);
        })
            .then(function (client) {
            connections.add(client);
        });
    };
    LanguageProvider.prototype._createClient = function (provider, syncExpression) {
        var connection;
        var client;
        var container = this._container.createChild();
        container.registerInstance(atom_languageservices_1.ISyncExpression, syncExpression);
        container.registerInstance(atom_languageservices_1.ILanguageProtocolClientOptions, provider.clientOptions);
        container.registerSingleton(atom_languageservices_1.IDocumentDelayer, atom_languageservices_1.Delayer);
        var capabilities = container.registerCapabilities(atom_languageservices_1.ILanguageProtocolClient);
        var errorHandler = function (error, message, count) {
            console.error(error, message, count);
        };
        var closeHandler = function () {
            /* */
        };
        var connectionOptions = {
            /* tslint:disable-next-line:no-any */
            closeHandler: closeHandler, errorHandler: errorHandler, output: function (x) { console.log(x); }
        };
        var cd = new ts_disposables_1.CompositeDisposable(container);
        this._disposable.add(cd);
        var connectionRequest = Connection_1.Connection.create(provider.serverOptions, connectionOptions);
        return connectionRequest.then(function (conn) {
            connection = conn;
            container.registerInstance(Connection_1.IConnection, connection);
            container.registerSingleton(LanguageProtocolClient_1.LanguageProtocolClient);
            container.registerAlias(LanguageProtocolClient_1.LanguageProtocolClient, atom_languageservices_1.ILanguageProtocolClient);
            client = container.resolve(LanguageProtocolClient_1.LanguageProtocolClient);
            cd.add(connection, client);
            return client.start().then(function () { return client; });
        }).then(function () {
            var disposables = container.resolveEach(_(capabilities)
                .filter(function (c) { return c.isCompatible(client.capabilities); })
                .map(function (x) { return x.ctor; })
                .value());
            for (var _i = 0, disposables_1 = disposables; _i < disposables_1.length; _i++) {
                var item = disposables_1[_i];
                if (item instanceof Error) {
                    console.error(item, item.innerError);
                }
                else if (item.dipose) {
                    cd.add(item);
                }
            }
            if (provider.onConnected) {
                provider.onConnected(client);
            }
            return client;
        });
    };
    return LanguageProvider;
}(ts_disposables_1.DisposableBase));
exports.LanguageProvider = LanguageProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFuZ3VhZ2VQcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYW5ndWFnZS9MYW5ndWFnZVByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCxJQUFZLENBQUMsV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUM1QixxQ0FBcUM7QUFDckMsc0NBQXVJLHVCQUF1QixDQUFDLENBQUE7QUFDL0osK0JBQW9ELGdCQUFnQixDQUFDLENBQUE7QUFFckUscUNBQXFDLDhCQUE4QixDQUFDLENBQUE7QUFDcEUsMkJBQXdDLHdCQUF3QixDQUFDLENBQUE7QUFFakUsdUNBQXVDLG9DQUFvQyxDQUFDLENBQUE7QUFDNUUsK0JBQStCLGtCQUFrQixDQUFDLENBQUE7QUFFbEQ7O0dBRUc7QUFDSDtJQUFzQyxvQ0FBYztJQU9oRCwwQkFBWSxTQUFvQixFQUFFLFNBQXdCO1FBUDlELGlCQStHQztRQXZHTyxpQkFBTyxDQUFDO1FBQ1IsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7UUFDNUIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLEdBQUcsRUFBbUQsQ0FBQztRQUMvRSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsU0FBUyxDQUFDO1FBQ25DLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxFQUF0QixDQUFzQixDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVNLDhCQUFHLEdBQVYsVUFBVyxRQUEyQjtRQUF0QyxpQkF1Q0M7UUF0Q0csRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNuQixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFsQixDQUFrQixDQUFDLENBQUM7WUFDdEQsTUFBTSxDQUFDO1FB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RSxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDakMsQ0FBQztZQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbEIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0wsdUJBQUM7QUFBRCxDQUFDLEFBL0dELENBQXNDLCtCQUFjLEdBK0duRDtBQS9HWSx3QkFBZ0IsbUJBK0c1QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG4vLyBpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IERlbGF5ZXIsIElEb2N1bWVudERlbGF5ZXIsIElMYW5ndWFnZVByb3RvY29sQ2xpZW50LCBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudE9wdGlvbnMsIElMYW5ndWFnZVByb3ZpZGVyLCBJU3luY0V4cHJlc3Npb24gfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMnO1xyXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlQmFzZSB9IGZyb20gJ3RzLWRpc3Bvc2FibGVzJztcclxuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJ3ZzY29kZS1qc29ucnBjJztcclxuaW1wb3J0IHsgQXRvbVRleHRFZGl0b3JTb3VyY2UgfSBmcm9tICcuLi9hdG9tL0F0b21UZXh0RWRpdG9yU291cmNlJztcclxuaW1wb3J0IHsgQ29ubmVjdGlvbiwgSUNvbm5lY3Rpb24gfSBmcm9tICcuLi9wcm90b2NvbC9Db25uZWN0aW9uJztcclxuaW1wb3J0IHsgQ29udGFpbmVyIH0gZnJvbSAnLi4vZGkvQ29udGFpbmVyJztcclxuaW1wb3J0IHsgTGFuZ3VhZ2VQcm90b2NvbENsaWVudCB9IGZyb20gJy4uL3Byb3RvY29sL0xhbmd1YWdlUHJvdG9jb2xDbGllbnQnO1xyXG5pbXBvcnQgeyBTeW5jRXhwcmVzc2lvbiB9IGZyb20gJy4vU3luY0V4cHJlc3Npb24nO1xyXG5cclxuLyoqXHJcbiAqIFRha2VzIGluIGFsbCB0aGUgZGlmZmVyZW50IGxhbmd1YWdlcyBwcm92aWRlZCBieSBvdGhlciBwYWNrYWdlcyBhbmQgY29uZmlndXJlcyB0aGVtLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIExhbmd1YWdlUHJvdmlkZXIgZXh0ZW5kcyBEaXNwb3NhYmxlQmFzZSB7XHJcbiAgICBwcml2YXRlIF9jb250YWluZXI6IENvbnRhaW5lcjtcclxuICAgIHByaXZhdGUgX2F0b21UZXh0RWRpdG9yU291cmNlOiBBdG9tVGV4dEVkaXRvclNvdXJjZTtcclxuICAgIHByaXZhdGUgX2Nvbm5lY3Rpb25zOiBNYXA8SUxhbmd1YWdlUHJvdmlkZXIsIFNldDxJTGFuZ3VhZ2VQcm90b2NvbENsaWVudD4+O1xyXG4gICAgcHJpdmF0ZSBfYWN0aXZhdGVkOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBfYWN0aXZhdGVkUHJvbWlzZTogUHJvbWlzZTx2b2lkPjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXI6IENvbnRhaW5lciwgYWN0aXZhdGVkOiBQcm9taXNlPHZvaWQ+KSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICAgICAgdGhpcy5fY29ubmVjdGlvbnMgPSBuZXcgTWFwPElMYW5ndWFnZVByb3ZpZGVyLCBTZXQ8SUxhbmd1YWdlUHJvdG9jb2xDbGllbnQ+PigpO1xyXG4gICAgICAgIHRoaXMuX2FjdGl2YXRlZFByb21pc2UgPSBhY3RpdmF0ZWQ7XHJcbiAgICAgICAgYWN0aXZhdGVkLnRoZW4oKCkgPT4gdGhpcy5fYWN0aXZhdGVkID0gdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZChwcm92aWRlcjogSUxhbmd1YWdlUHJvdmlkZXIpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2FjdGl2YXRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9hY3RpdmF0ZWRQcm9taXNlLnRoZW4oKCkgPT4gdGhpcy5hZGQocHJvdmlkZXIpKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLl9hdG9tVGV4dEVkaXRvclNvdXJjZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9hdG9tVGV4dEVkaXRvclNvdXJjZSA9IHRoaXMuX2NvbnRhaW5lci5yZXNvbHZlKEF0b21UZXh0RWRpdG9yU291cmNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fY29ubmVjdGlvbnMuaGFzKHByb3ZpZGVyKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9ucy5zZXQocHJvdmlkZXIsIG5ldyBTZXQ8SUxhbmd1YWdlUHJvdG9jb2xDbGllbnQ+KCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY29ubmVjdGlvbnMgPSB0aGlzLl9jb25uZWN0aW9ucy5nZXQocHJvdmlkZXIpICE7XHJcbiAgICAgICAgY29uc3Qgc3luY0V4cHJlc3Npb24gPSBTeW5jRXhwcmVzc2lvbi5jcmVhdGUocHJvdmlkZXIuY2xpZW50T3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5fYXRvbVRleHRFZGl0b3JTb3VyY2Uub2JzZXJ2ZVRleHRFZGl0b3JzXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZWRpdG9yID0+IHN5bmNFeHByZXNzaW9uLmV2YWx1YXRlKGVkaXRvcikpXHJcbiAgICAgICAgICAgIC8vIC5jb25jYXRNYXAoZWRpdG9yID0+IHtcclxuICAgICAgICAgICAgLy8gICAgIC8vIEFsbG93IG11bHRpcGxlIGxhbmd1YWdlIHNlcnZlcnMgdG8gcnVuIGEgZ2l2ZW4gbGFuZ3VhZ2UuXHJcbiAgICAgICAgICAgIC8vICAgICAvLyBCYXNlZCBvbiB0aGUgY29udGV4dCBvZiB0aGUgbGFuZ3VhZ2Ugc2VydmVyIChjb3VsZCBiZSBmcm9tIGEgZGlmZmVyZW50IHByb2plY3QsIGZvciBleGFtcGxlKVxyXG4gICAgICAgICAgICAvLyAgICAgaWYgKHByb3ZpZGVyLmNob29zZUNvbm5lY3Rpb24pIHtcclxuICAgICAgICAgICAgLy8gICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5mcm9tUHJvbWlzZShwcm92aWRlci5jaG9vc2VDb25uZWN0aW9uKHtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgY29ubmVjdGlvbnM6IF8udG9BcnJheShjb25uZWN0aW9ucyksXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIGVkaXRvclxyXG4gICAgICAgICAgICAvLyAgICAgICAgIH0pKVxyXG4gICAgICAgICAgICAvLyAgICAgICAgIC5maWx0ZXIoeCA9PiB4KS5tYXAoKCkgPT4gZWRpdG9yKTtcclxuICAgICAgICAgICAgLy8gICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vICAgICByZXR1cm4gT2JzZXJ2YWJsZS5vZihlZGl0b3IpO1xyXG4gICAgICAgICAgICAvLyB9KVxyXG4gICAgICAgICAgICAudGFrZSgxKVxyXG4gICAgICAgICAgICAudG9Qcm9taXNlKClcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUNsaWVudChwcm92aWRlciwgc3luY0V4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbihjbGllbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29ubmVjdGlvbnMuYWRkKGNsaWVudCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2NyZWF0ZUNsaWVudChwcm92aWRlcjogSUxhbmd1YWdlUHJvdmlkZXIsIHN5bmNFeHByZXNzaW9uOiBJU3luY0V4cHJlc3Npb24pIHtcclxuICAgICAgICBsZXQgY29ubmVjdGlvbjogSUNvbm5lY3Rpb247XHJcbiAgICAgICAgbGV0IGNsaWVudDogTGFuZ3VhZ2VQcm90b2NvbENsaWVudDtcclxuICAgICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLl9jb250YWluZXIuY3JlYXRlQ2hpbGQoKTtcclxuICAgICAgICBjb250YWluZXIucmVnaXN0ZXJJbnN0YW5jZShJU3luY0V4cHJlc3Npb24sIHN5bmNFeHByZXNzaW9uKTtcclxuICAgICAgICBjb250YWluZXIucmVnaXN0ZXJJbnN0YW5jZShJTGFuZ3VhZ2VQcm90b2NvbENsaWVudE9wdGlvbnMsIHByb3ZpZGVyLmNsaWVudE9wdGlvbnMpO1xyXG4gICAgICAgIGNvbnRhaW5lci5yZWdpc3RlclNpbmdsZXRvbihJRG9jdW1lbnREZWxheWVyLCBEZWxheWVyKTtcclxuICAgICAgICBjb25zdCBjYXBhYmlsaXRpZXMgPSBjb250YWluZXIucmVnaXN0ZXJDYXBhYmlsaXRpZXMoSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQpO1xyXG5cclxuICAgICAgICBjb25zdCBlcnJvckhhbmRsZXIgPSAoZXJyb3I6IEVycm9yLCBtZXNzYWdlOiBNZXNzYWdlLCBjb3VudDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IsIG1lc3NhZ2UsIGNvdW50KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBjbG9zZUhhbmRsZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIC8qICovXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgY29ubmVjdGlvbk9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIC8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnkgKi9cclxuICAgICAgICAgICAgY2xvc2VIYW5kbGVyLCBlcnJvckhhbmRsZXIsIG91dHB1dCh4OiBhbnkpIHsgY29uc29sZS5sb2coeCk7IH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBjZCA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKGNvbnRhaW5lcik7XHJcbiAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQoY2QpO1xyXG5cclxuICAgICAgICBjb25zdCBjb25uZWN0aW9uUmVxdWVzdCA9IENvbm5lY3Rpb24uY3JlYXRlKHByb3ZpZGVyLnNlcnZlck9wdGlvbnMsIGNvbm5lY3Rpb25PcHRpb25zKTtcclxuICAgICAgICByZXR1cm4gY29ubmVjdGlvblJlcXVlc3QudGhlbihjb25uID0+IHtcclxuICAgICAgICAgICAgY29ubmVjdGlvbiA9IGNvbm47XHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5yZWdpc3Rlckluc3RhbmNlKElDb25uZWN0aW9uLCBjb25uZWN0aW9uKTtcclxuICAgICAgICAgICAgY29udGFpbmVyLnJlZ2lzdGVyU2luZ2xldG9uKExhbmd1YWdlUHJvdG9jb2xDbGllbnQpO1xyXG4gICAgICAgICAgICBjb250YWluZXIucmVnaXN0ZXJBbGlhcyhMYW5ndWFnZVByb3RvY29sQ2xpZW50LCBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCk7XHJcblxyXG4gICAgICAgICAgICBjbGllbnQgPSBjb250YWluZXIucmVzb2x2ZShMYW5ndWFnZVByb3RvY29sQ2xpZW50KTtcclxuICAgICAgICAgICAgY2QuYWRkKGNvbm5lY3Rpb24sIGNsaWVudCk7XHJcbiAgICAgICAgICAgIHJldHVybiBjbGllbnQuc3RhcnQoKS50aGVuKCgpID0+IGNsaWVudCk7XHJcbiAgICAgICAgfSkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpc3Bvc2FibGVzID0gY29udGFpbmVyLnJlc29sdmVFYWNoKFxyXG4gICAgICAgICAgICAgICAgXyhjYXBhYmlsaXRpZXMpXHJcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihjID0+IGMuaXNDb21wYXRpYmxlKGNsaWVudC5jYXBhYmlsaXRpZXMpKVxyXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoeCA9PiB4LmN0b3IpXHJcbiAgICAgICAgICAgICAgICAgICAgLnZhbHVlKClcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGRpc3Bvc2FibGVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIEVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihpdGVtLCBpdGVtLmlubmVyRXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtLmRpcG9zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNkLmFkZChpdGVtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvdmlkZXIub25Db25uZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgIHByb3ZpZGVyLm9uQ29ubmVjdGVkKGNsaWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGNsaWVudDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iXX0=