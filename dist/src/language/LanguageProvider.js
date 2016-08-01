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
// import * as _ from 'lodash';
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
    function LanguageProvider(container) {
        _super.call(this);
        this._container = container;
        this._connections = new Map();
    }
    LanguageProvider.prototype.add = function (provider) {
        var _this = this;
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
            var disposables = container.resolveEach(capabilities);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFuZ3VhZ2VQcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYW5ndWFnZS9MYW5ndWFnZVByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCwrQkFBK0I7QUFDL0IscUNBQXFDO0FBQ3JDLHNDQUF1SSx1QkFBdUIsQ0FBQyxDQUFBO0FBQy9KLCtCQUFvRCxnQkFBZ0IsQ0FBQyxDQUFBO0FBRXJFLHFDQUFxQyw4QkFBOEIsQ0FBQyxDQUFBO0FBQ3BFLDJCQUF3Qyx3QkFBd0IsQ0FBQyxDQUFBO0FBRWpFLHVDQUF1QyxvQ0FBb0MsQ0FBQyxDQUFBO0FBQzVFLCtCQUErQixrQkFBa0IsQ0FBQyxDQUFBO0FBRWxEOztHQUVHO0FBQ0g7SUFBc0Msb0NBQWM7SUFLaEQsMEJBQVksU0FBb0I7UUFDNUIsaUJBQU8sQ0FBQztRQUNSLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO1FBQzVCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxHQUFHLEVBQW1ELENBQUM7SUFDbkYsQ0FBQztJQUVNLDhCQUFHLEdBQVYsVUFBVyxRQUEyQjtRQUF0QyxpQkFrQ0M7UUFqQ0csRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQywyQ0FBb0IsQ0FBQyxDQUFDO1FBQy9FLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxHQUFHLEVBQTJCLENBQUMsQ0FBQztRQUN4RSxDQUFDO1FBRUQsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFlBQVks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Q0FBQyxZQUFZLENBQUMsQ0FBQztZQUN4RCxHQUFHLENBQUMsQ0FBZSxVQUFXLEVBQVgsMkJBQVcsRUFBWCx5QkFBVyxFQUFYLElBQVcsQ0FBQztnQkFBMUIsSUFBTSxJQUFJLG9CQUFBO2dCQUNYLEVBQUUsQ0FBQyxDQUFDLElBQUksWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN4QixPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ3pDLENBQUM7Z0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNyQixFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNqQixDQUFDO2FBQ0o7WUFDRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDdkIsUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNqQyxDQUFDO1lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNsQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDTCx1QkFBQztBQUFELENBQUMsQUFqR0QsQ0FBc0MsK0JBQWMsR0FpR25EO0FBakdZLHdCQUFnQixtQkFpRzVCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogIEBsaWNlbnNlICAgTUlUXHJcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG4vLyBpbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XHJcbi8vIGltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgRGVsYXllciwgSURvY3VtZW50RGVsYXllciwgSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQsIElMYW5ndWFnZVByb3RvY29sQ2xpZW50T3B0aW9ucywgSUxhbmd1YWdlUHJvdmlkZXIsIElTeW5jRXhwcmVzc2lvbiB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGVCYXNlIH0gZnJvbSAndHMtZGlzcG9zYWJsZXMnO1xyXG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAndnNjb2RlLWpzb25ycGMnO1xyXG5pbXBvcnQgeyBBdG9tVGV4dEVkaXRvclNvdXJjZSB9IGZyb20gJy4uL2F0b20vQXRvbVRleHRFZGl0b3JTb3VyY2UnO1xyXG5pbXBvcnQgeyBDb25uZWN0aW9uLCBJQ29ubmVjdGlvbiB9IGZyb20gJy4uL3Byb3RvY29sL0Nvbm5lY3Rpb24nO1xyXG5pbXBvcnQgeyBDb250YWluZXIgfSBmcm9tICcuLi9kaS9Db250YWluZXInO1xyXG5pbXBvcnQgeyBMYW5ndWFnZVByb3RvY29sQ2xpZW50IH0gZnJvbSAnLi4vcHJvdG9jb2wvTGFuZ3VhZ2VQcm90b2NvbENsaWVudCc7XHJcbmltcG9ydCB7IFN5bmNFeHByZXNzaW9uIH0gZnJvbSAnLi9TeW5jRXhwcmVzc2lvbic7XHJcblxyXG4vKipcclxuICogVGFrZXMgaW4gYWxsIHRoZSBkaWZmZXJlbnQgbGFuZ3VhZ2VzIHByb3ZpZGVkIGJ5IG90aGVyIHBhY2thZ2VzIGFuZCBjb25maWd1cmVzIHRoZW0uXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTGFuZ3VhZ2VQcm92aWRlciBleHRlbmRzIERpc3Bvc2FibGVCYXNlIHtcclxuICAgIHByaXZhdGUgX2NvbnRhaW5lcjogQ29udGFpbmVyO1xyXG4gICAgcHJpdmF0ZSBfYXRvbVRleHRFZGl0b3JTb3VyY2U6IEF0b21UZXh0RWRpdG9yU291cmNlO1xyXG4gICAgcHJpdmF0ZSBfY29ubmVjdGlvbnM6IE1hcDxJTGFuZ3VhZ2VQcm92aWRlciwgU2V0PElMYW5ndWFnZVByb3RvY29sQ2xpZW50Pj47XHJcblxyXG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyOiBDb250YWluZXIpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgICAgICB0aGlzLl9jb25uZWN0aW9ucyA9IG5ldyBNYXA8SUxhbmd1YWdlUHJvdmlkZXIsIFNldDxJTGFuZ3VhZ2VQcm90b2NvbENsaWVudD4+KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZChwcm92aWRlcjogSUxhbmd1YWdlUHJvdmlkZXIpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2F0b21UZXh0RWRpdG9yU291cmNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2F0b21UZXh0RWRpdG9yU291cmNlID0gdGhpcy5fY29udGFpbmVyLnJlc29sdmUoQXRvbVRleHRFZGl0b3JTb3VyY2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLl9jb25uZWN0aW9ucy5oYXMocHJvdmlkZXIpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb25zLnNldChwcm92aWRlciwgbmV3IFNldDxJTGFuZ3VhZ2VQcm90b2NvbENsaWVudD4oKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjb25uZWN0aW9ucyA9IHRoaXMuX2Nvbm5lY3Rpb25zLmdldChwcm92aWRlcikgITtcclxuICAgICAgICBjb25zdCBzeW5jRXhwcmVzc2lvbiA9IFN5bmNFeHByZXNzaW9uLmNyZWF0ZShwcm92aWRlci5jbGllbnRPcHRpb25zKTtcclxuICAgICAgICB0aGlzLl9hdG9tVGV4dEVkaXRvclNvdXJjZS5vYnNlcnZlVGV4dEVkaXRvcnNcclxuICAgICAgICAgICAgLmZpbHRlcihlZGl0b3IgPT4gc3luY0V4cHJlc3Npb24uZXZhbHVhdGUoZWRpdG9yKSlcclxuICAgICAgICAgICAgLy8gLmNvbmNhdE1hcChlZGl0b3IgPT4ge1xyXG4gICAgICAgICAgICAvLyAgICAgLy8gQWxsb3cgbXVsdGlwbGUgbGFuZ3VhZ2Ugc2VydmVycyB0byBydW4gYSBnaXZlbiBsYW5ndWFnZS5cclxuICAgICAgICAgICAgLy8gICAgIC8vIEJhc2VkIG9uIHRoZSBjb250ZXh0IG9mIHRoZSBsYW5ndWFnZSBzZXJ2ZXIgKGNvdWxkIGJlIGZyb20gYSBkaWZmZXJlbnQgcHJvamVjdCwgZm9yIGV4YW1wbGUpXHJcbiAgICAgICAgICAgIC8vICAgICBpZiAocHJvdmlkZXIuY2hvb3NlQ29ubmVjdGlvbikge1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIHJldHVybiBPYnNlcnZhYmxlLmZyb21Qcm9taXNlKHByb3ZpZGVyLmNob29zZUNvbm5lY3Rpb24oe1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBjb25uZWN0aW9uczogXy50b0FycmF5KGNvbm5lY3Rpb25zKSxcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgZWRpdG9yXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgfSkpXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgLmZpbHRlcih4ID0+IHgpLm1hcCgoKSA9PiBlZGl0b3IpO1xyXG4gICAgICAgICAgICAvLyAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gICAgIHJldHVybiBPYnNlcnZhYmxlLm9mKGVkaXRvcik7XHJcbiAgICAgICAgICAgIC8vIH0pXHJcbiAgICAgICAgICAgIC50YWtlKDEpXHJcbiAgICAgICAgICAgIC50b1Byb21pc2UoKVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY3JlYXRlQ2xpZW50KHByb3ZpZGVyLCBzeW5jRXhwcmVzc2lvbik7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKGNsaWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25uZWN0aW9ucy5hZGQoY2xpZW50KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfY3JlYXRlQ2xpZW50KHByb3ZpZGVyOiBJTGFuZ3VhZ2VQcm92aWRlciwgc3luY0V4cHJlc3Npb246IElTeW5jRXhwcmVzc2lvbikge1xyXG4gICAgICAgIGxldCBjb25uZWN0aW9uOiBJQ29ubmVjdGlvbjtcclxuICAgICAgICBsZXQgY2xpZW50OiBMYW5ndWFnZVByb3RvY29sQ2xpZW50O1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuX2NvbnRhaW5lci5jcmVhdGVDaGlsZCgpO1xyXG4gICAgICAgIGNvbnRhaW5lci5yZWdpc3Rlckluc3RhbmNlKElTeW5jRXhwcmVzc2lvbiwgc3luY0V4cHJlc3Npb24pO1xyXG4gICAgICAgIGNvbnRhaW5lci5yZWdpc3Rlckluc3RhbmNlKElMYW5ndWFnZVByb3RvY29sQ2xpZW50T3B0aW9ucywgcHJvdmlkZXIuY2xpZW50T3B0aW9ucyk7XHJcbiAgICAgICAgY29udGFpbmVyLnJlZ2lzdGVyU2luZ2xldG9uKElEb2N1bWVudERlbGF5ZXIsIERlbGF5ZXIpO1xyXG4gICAgICAgIGNvbnN0IGNhcGFiaWxpdGllcyA9IGNvbnRhaW5lci5yZWdpc3RlckNhcGFiaWxpdGllcyhJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGVycm9ySGFuZGxlciA9IChlcnJvcjogRXJyb3IsIG1lc3NhZ2U6IE1lc3NhZ2UsIGNvdW50OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvciwgbWVzc2FnZSwgY291bnQpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGNsb3NlSGFuZGxlciA9ICgpID0+IHtcclxuICAgICAgICAgICAgLyogKi9cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBjb25uZWN0aW9uT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueSAqL1xyXG4gICAgICAgICAgICBjbG9zZUhhbmRsZXIsIGVycm9ySGFuZGxlciwgb3V0cHV0KHg6IGFueSkgeyBjb25zb2xlLmxvZyh4KTsgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGNkID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoY29udGFpbmVyKTtcclxuICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLmFkZChjZCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbm5lY3Rpb25SZXF1ZXN0ID0gQ29ubmVjdGlvbi5jcmVhdGUocHJvdmlkZXIuc2VydmVyT3B0aW9ucywgY29ubmVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgIHJldHVybiBjb25uZWN0aW9uUmVxdWVzdC50aGVuKGNvbm4gPT4ge1xyXG4gICAgICAgICAgICBjb25uZWN0aW9uID0gY29ubjtcclxuICAgICAgICAgICAgY29udGFpbmVyLnJlZ2lzdGVySW5zdGFuY2UoSUNvbm5lY3Rpb24sIGNvbm5lY3Rpb24pO1xyXG4gICAgICAgICAgICBjb250YWluZXIucmVnaXN0ZXJTaW5nbGV0b24oTGFuZ3VhZ2VQcm90b2NvbENsaWVudCk7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5yZWdpc3RlckFsaWFzKExhbmd1YWdlUHJvdG9jb2xDbGllbnQsIElMYW5ndWFnZVByb3RvY29sQ2xpZW50KTtcclxuXHJcbiAgICAgICAgICAgIGNsaWVudCA9IGNvbnRhaW5lci5yZXNvbHZlKExhbmd1YWdlUHJvdG9jb2xDbGllbnQpO1xyXG4gICAgICAgICAgICBjZC5hZGQoY29ubmVjdGlvbiwgY2xpZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuIGNsaWVudC5zdGFydCgpLnRoZW4oKCkgPT4gY2xpZW50KTtcclxuICAgICAgICB9KS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZGlzcG9zYWJsZXMgPSBjb250YWluZXIucmVzb2x2ZUVhY2goY2FwYWJpbGl0aWVzKTtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGRpc3Bvc2FibGVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIEVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihpdGVtLCBpdGVtLmlubmVyRXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtLmRpcG9zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNkLmFkZChpdGVtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvdmlkZXIub25Db25uZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgIHByb3ZpZGVyLm9uQ29ubmVjdGVkKGNsaWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGNsaWVudDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iXX0=