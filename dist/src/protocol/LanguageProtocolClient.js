"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
var rxjs_1 = require('rxjs');
var atom_languageservices_1 = require('atom-languageservices');
var decorators_1 = require('atom-languageservices/decorators');
var protocol_1 = require('atom-languageservices/protocol');
var types_1 = require('atom-languageservices/types');
var ts_disposables_1 = require('ts-disposables');
var vscode_jsonrpc_1 = require('vscode-jsonrpc');
var observePromise_1 = require('../helpers/observePromise');
var Connection_1 = require('./Connection');
var LanguageProtocolClient = (function (_super) {
    __extends(LanguageProtocolClient, _super);
    function LanguageProtocolClient(projectProvider, connection, options, syncExpression, documentDelayer) {
        var _this = this;
        _super.call(this);
        this._projectProvider = projectProvider;
        this._connection = connection;
        this._options = options;
        this._state = atom_languageservices_1.ClientState.Initial;
        this._documentDelayer = documentDelayer;
        this._disposable.add(this._documentDelayer, ts_disposables_1.Disposable.create(function () {
            _this.stop();
        }));
    }
    Object.defineProperty(LanguageProtocolClient.prototype, "state", {
        get: function () { return this._state; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguageProtocolClient.prototype, "capabilities", {
        get: function () { return this._capabilities; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguageProtocolClient.prototype, "options", {
        get: function () { return this._options; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguageProtocolClient.prototype, "name", {
        get: function () { return this._options.diagnosticCollectionName || this._options.outputChannelName || 'languageprotocol'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguageProtocolClient.prototype, "rootPath", {
        get: function () { return this._projectProvider.getPaths()[0] || process.cwd(); },
        enumerable: true,
        configurable: true
    });
    LanguageProtocolClient.prototype.start = function () {
        this._state = atom_languageservices_1.ClientState.Starting;
        this._connection.onLogMessage(function (message) {
            var obj = message.message;
            try {
                obj = JSON.parse(obj);
            }
            catch (e) { }
            switch (message.type) {
                case types_1.MessageType.Error:
                    console.error("[Error]", obj);
                    break;
                case types_1.MessageType.Warning:
                    console.warn("[Warn]", obj);
                    break;
                case types_1.MessageType.Info:
                    console.info("[Info]", obj);
                    break;
                default:
                    console.log(message.message);
            }
        });
        this._connection.onShowMessage(function (message) {
            // switch (message.type) {
            //     case MessageType.Error:
            //         Window.showErrorMessage(message.message);
            //         break;
            //     case MessageType.Warning:
            //         Window.showWarningMessage(message.message);
            //         break;
            //     case MessageType.Info:
            //         Window.showInformationMessage(message.message);
            //         break;
            //     default:
            //         Window.showInformationMessage(message.message);
            // }
        });
        this._connection.onRequest(protocol_1.ShowMessageRequest.type, function (params) {
            return null;
            // let messageFunc: <T extends MessageItem>(message: string, ...items: T[]) => Thenable<T> = null;
            // switch (params.type) {
            //     case MessageType.Error:
            //         messageFunc = Window.showErrorMessage;
            //         break;
            //     case MessageType.Warning:
            //         messageFunc = Window.showWarningMessage;
            //         break;
            //     case MessageType.Info:
            //     default:
            //         messageFunc = Window.showInformationMessage;
            //         break;
            // }
            // return messageFunc(params.message, ...params.actions);
        });
        this._connection.onTelemetry(function (data) {
            console.log(data);
        });
        this._connection.listen();
        return this._initialize();
    };
    LanguageProtocolClient.prototype._initialize = function () {
        var _this = this;
        var initParams = {
            processId: process.pid,
            rootPath: this.rootPath,
            capabilities: { highlightProvider: true },
            initializationOptions: this._options.initializationOptions
        };
        return this._connection.initialize(initParams)
            .then(function (result) {
            _this._state = atom_languageservices_1.ClientState.Running;
            _this._capabilities = result.capabilities;
            if (!_this._capabilities.extended) {
                _this._capabilities.extended = {};
            }
            return result;
        }, function (error) {
            console.error(error);
            if (error && error.data && error.data.retry) {
            }
            else {
            }
            _this.stop();
        });
    };
    LanguageProtocolClient.prototype.stop = function () {
        var _this = this;
        if (!this._connection) {
            this._state = atom_languageservices_1.ClientState.Stopped;
            return;
        }
        this._state = atom_languageservices_1.ClientState.Stopping;
        this._cleanUp();
        // unkook listeners
        this._connection.shutdown().then(function () {
            _this._connection.exit();
            _this._connection.dispose();
            _this._state = atom_languageservices_1.ClientState.Stopped;
        });
    };
    LanguageProtocolClient.prototype._cleanUp = function () {
        this.dispose();
    };
    Object.defineProperty(LanguageProtocolClient.prototype, "_isConnectionActive", {
        get: function () {
            return this._state === atom_languageservices_1.ClientState.Running;
        },
        enumerable: true,
        configurable: true
    });
    LanguageProtocolClient.prototype.sendRequest = function (type, params) {
        return this._doSendRequest(this._connection, type, params);
    };
    LanguageProtocolClient.prototype._doSendRequest = function (connection, type, params) {
        if (this._isConnectionActive) {
            this._documentDelayer.force();
            return observePromise_1.observePromise(function (token) { return connection.sendRequest(type, params, token); });
        }
        else {
            return rxjs_1.Observable.throw(new vscode_jsonrpc_1.ResponseError(vscode_jsonrpc_1.ErrorCodes.InternalError, 'Connection is closed.'));
        }
    };
    LanguageProtocolClient.prototype.sendNotification = function (type, params) {
        if (this._isConnectionActive) {
            // this._documentDelayer.force();
            this._connection.sendNotification(type, params);
        }
    };
    LanguageProtocolClient.prototype.onNotification = function (type, handler) {
        this._connection.onNotification(type, handler);
    };
    LanguageProtocolClient.prototype.onRequest = function (type, handler) {
        this._connection.onRequest(type, handler);
    };
    LanguageProtocolClient = __decorate([
        __param(0, decorators_1.inject(atom_languageservices_1.IProjectProvider)),
        __param(1, decorators_1.inject(Connection_1.IConnection)),
        __param(2, decorators_1.inject(atom_languageservices_1.ILanguageProtocolClientOptions)),
        __param(3, decorators_1.inject(atom_languageservices_1.ISyncExpression)),
        __param(4, decorators_1.inject(atom_languageservices_1.IDocumentDelayer)), 
        __metadata('design:paramtypes', [Object, Object, Object, Object, Object])
    ], LanguageProtocolClient);
    return LanguageProtocolClient;
}(ts_disposables_1.DisposableBase));
exports.LanguageProtocolClient = LanguageProtocolClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFuZ3VhZ2VQcm90b2NvbENsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcm90b2NvbC9MYW5ndWFnZVByb3RvY29sQ2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCwyQkFBMkI7QUFDM0IscUJBQTJCLE1BQU0sQ0FBQyxDQUFBO0FBQ2xDLHNDQUEwSSx1QkFBdUIsQ0FBQyxDQUFBO0FBQ2xLLDJCQUF1QixrQ0FBa0MsQ0FBQyxDQUFBO0FBQzFELHlCQUFtQyxnQ0FBZ0MsQ0FBQyxDQUFBO0FBQ3BFLHNCQUFpRiw2QkFBNkIsQ0FBQyxDQUFBO0FBRS9HLCtCQUEyQyxnQkFBZ0IsQ0FBQyxDQUFBO0FBQzVELCtCQUF1SSxnQkFBZ0IsQ0FBQyxDQUFBO0FBQ3hKLCtCQUErQiwyQkFBMkIsQ0FBQyxDQUFBO0FBQzNELDJCQUE0QixjQUFjLENBQUMsQ0FBQTtBQUUzQztJQUE0QywwQ0FBYztJQWN0RCxnQ0FDOEIsZUFBaUMsRUFDdEMsVUFBdUIsRUFDSixPQUF1QyxFQUN0RCxjQUErQixFQUM5QixlQUFpQztRQW5CbkUsaUJBNExDO1FBeEtPLGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsZUFBZSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxNQUFNLEdBQUcsbUNBQVcsQ0FBQyxPQUFPLENBQUM7UUFDbEMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGVBQWUsQ0FBQztRQUV4QyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FDaEIsSUFBSSxDQUFDLGdCQUFnQixFQUNyQiwyQkFBVSxDQUFDLE1BQU0sQ0FBQztZQUNkLEtBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNoQixDQUFDLENBQUMsQ0FDTCxD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LEdBNEx6RDtBQTVMWSw4QkFBc0IseUJBNExsQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuLyogdHNsaW50OmRpc2FibGU6bm8tYW55ICovXHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgQ2xpZW50U3RhdGUsIElEb2N1bWVudERlbGF5ZXIsIElMYW5ndWFnZVByb3RvY29sQ2xpZW50LCBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudE9wdGlvbnMsIElQcm9qZWN0UHJvdmlkZXIsIElTeW5jRXhwcmVzc2lvbiB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCB7IGluamVjdCB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9kZWNvcmF0b3JzJztcclxuaW1wb3J0IHsgU2hvd01lc3NhZ2VSZXF1ZXN0IH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL3Byb3RvY29sJztcclxuaW1wb3J0IHsgSW5pdGlhbGl6ZUVycm9yLCBJbml0aWFsaXplUGFyYW1zLCBJbml0aWFsaXplUmVzdWx0LCBNZXNzYWdlVHlwZSB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy90eXBlcyc7XHJcbmltcG9ydCB7IFNlcnZlckNhcGFiaWxpdGllcyB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy90eXBlcy1leHRlbmRlZCc7XHJcbmltcG9ydCB7IERpc3Bvc2FibGUsIERpc3Bvc2FibGVCYXNlIH0gZnJvbSAndHMtZGlzcG9zYWJsZXMnO1xyXG5pbXBvcnQgeyBDYW5jZWxsYXRpb25Ub2tlblNvdXJjZSwgRXJyb3JDb2RlcywgTm90aWZpY2F0aW9uSGFuZGxlciwgTm90aWZpY2F0aW9uVHlwZSwgUmVxdWVzdEhhbmRsZXIsIFJlcXVlc3RUeXBlLCBSZXNwb25zZUVycm9yIH0gZnJvbSAndnNjb2RlLWpzb25ycGMnO1xyXG5pbXBvcnQgeyBvYnNlcnZlUHJvbWlzZSB9IGZyb20gJy4uL2hlbHBlcnMvb2JzZXJ2ZVByb21pc2UnO1xyXG5pbXBvcnQgeyBJQ29ubmVjdGlvbiB9IGZyb20gJy4vQ29ubmVjdGlvbic7XHJcblxyXG5leHBvcnQgY2xhc3MgTGFuZ3VhZ2VQcm90b2NvbENsaWVudCBleHRlbmRzIERpc3Bvc2FibGVCYXNlIGltcGxlbWVudHMgSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQge1xyXG4gICAgcHJpdmF0ZSBfY2FwYWJpbGl0aWVzOiBTZXJ2ZXJDYXBhYmlsaXRpZXM7XHJcbiAgICBwcml2YXRlIF9jb25uZWN0aW9uOiBJQ29ubmVjdGlvbjtcclxuICAgIHByaXZhdGUgX3Byb2plY3RQcm92aWRlcjogSVByb2plY3RQcm92aWRlcjtcclxuICAgIHByaXZhdGUgX3N0YXRlOiBDbGllbnRTdGF0ZTtcclxuICAgIHByaXZhdGUgX29wdGlvbnM6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50T3B0aW9ucztcclxuICAgIHByaXZhdGUgX2RvY3VtZW50RGVsYXllcjogSURvY3VtZW50RGVsYXllcjtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IHN0YXRlKCkgeyByZXR1cm4gdGhpcy5fc3RhdGU7IH1cclxuICAgIHB1YmxpYyBnZXQgY2FwYWJpbGl0aWVzKCkgeyByZXR1cm4gdGhpcy5fY2FwYWJpbGl0aWVzOyB9XHJcbiAgICBwdWJsaWMgZ2V0IG9wdGlvbnMoKSB7IHJldHVybiB0aGlzLl9vcHRpb25zOyB9XHJcbiAgICBwdWJsaWMgZ2V0IG5hbWUoKSB7IHJldHVybiB0aGlzLl9vcHRpb25zLmRpYWdub3N0aWNDb2xsZWN0aW9uTmFtZSB8fCB0aGlzLl9vcHRpb25zLm91dHB1dENoYW5uZWxOYW1lIHx8ICdsYW5ndWFnZXByb3RvY29sJzsgfVxyXG4gICAgcHVibGljIGdldCByb290UGF0aCgpIHsgcmV0dXJuIHRoaXMuX3Byb2plY3RQcm92aWRlci5nZXRQYXRocygpWzBdIHx8IHByb2Nlc3MuY3dkKCk7IH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBAaW5qZWN0KElQcm9qZWN0UHJvdmlkZXIpIHByb2plY3RQcm92aWRlcjogSVByb2plY3RQcm92aWRlcixcclxuICAgICAgICBAaW5qZWN0KElDb25uZWN0aW9uKSBjb25uZWN0aW9uOiBJQ29ubmVjdGlvbixcclxuICAgICAgICBAaW5qZWN0KElMYW5ndWFnZVByb3RvY29sQ2xpZW50T3B0aW9ucykgb3B0aW9uczogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnRPcHRpb25zLFxyXG4gICAgICAgIEBpbmplY3QoSVN5bmNFeHByZXNzaW9uKSBzeW5jRXhwcmVzc2lvbjogSVN5bmNFeHByZXNzaW9uLFxyXG4gICAgICAgIEBpbmplY3QoSURvY3VtZW50RGVsYXllcikgZG9jdW1lbnREZWxheWVyOiBJRG9jdW1lbnREZWxheWVyKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9wcm9qZWN0UHJvdmlkZXIgPSBwcm9qZWN0UHJvdmlkZXI7XHJcbiAgICAgICAgdGhpcy5fY29ubmVjdGlvbiA9IGNvbm5lY3Rpb247XHJcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgICAgICAgdGhpcy5fc3RhdGUgPSBDbGllbnRTdGF0ZS5Jbml0aWFsO1xyXG4gICAgICAgIHRoaXMuX2RvY3VtZW50RGVsYXllciA9IGRvY3VtZW50RGVsYXllcjtcclxuXHJcbiAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQoXHJcbiAgICAgICAgICAgIHRoaXMuX2RvY3VtZW50RGVsYXllcixcclxuICAgICAgICAgICAgRGlzcG9zYWJsZS5jcmVhdGUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnQoKSB7XHJcbiAgICAgICAgdGhpcy5fc3RhdGUgPSBDbGllbnRTdGF0ZS5TdGFydGluZztcclxuICAgICAgICB0aGlzLl9jb25uZWN0aW9uLm9uTG9nTWVzc2FnZSgobWVzc2FnZSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgb2JqOiBhbnkgPSBtZXNzYWdlLm1lc3NhZ2U7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBvYmogPSBKU09OLnBhcnNlKG9iaik7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHsgfVxyXG4gICAgICAgICAgICBzd2l0Y2ggKG1lc3NhZ2UudHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBNZXNzYWdlVHlwZS5FcnJvcjpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBbRXJyb3JdYCwgb2JqKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgTWVzc2FnZVR5cGUuV2FybmluZzpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYFtXYXJuXWAsIG9iaik7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE1lc3NhZ2VUeXBlLkluZm86XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5pbmZvKGBbSW5mb11gLCBvYmopO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhtZXNzYWdlLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5vblNob3dNZXNzYWdlKChtZXNzYWdlKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIHN3aXRjaCAobWVzc2FnZS50eXBlKSB7XHJcbiAgICAgICAgICAgIC8vICAgICBjYXNlIE1lc3NhZ2VUeXBlLkVycm9yOlxyXG4gICAgICAgICAgICAvLyAgICAgICAgIFdpbmRvdy5zaG93RXJyb3JNZXNzYWdlKG1lc3NhZ2UubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIC8vICAgICBjYXNlIE1lc3NhZ2VUeXBlLldhcm5pbmc6XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgV2luZG93LnNob3dXYXJuaW5nTWVzc2FnZShtZXNzYWdlLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAvLyAgICAgY2FzZSBNZXNzYWdlVHlwZS5JbmZvOlxyXG4gICAgICAgICAgICAvLyAgICAgICAgIFdpbmRvdy5zaG93SW5mb3JtYXRpb25NZXNzYWdlKG1lc3NhZ2UubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIC8vICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAvLyAgICAgICAgIFdpbmRvdy5zaG93SW5mb3JtYXRpb25NZXNzYWdlKG1lc3NhZ2UubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9jb25uZWN0aW9uLm9uUmVxdWVzdChTaG93TWVzc2FnZVJlcXVlc3QudHlwZSwgKHBhcmFtcykgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gPGFueT5udWxsO1xyXG4gICAgICAgICAgICAvLyBsZXQgbWVzc2FnZUZ1bmM6IDxUIGV4dGVuZHMgTWVzc2FnZUl0ZW0+KG1lc3NhZ2U6IHN0cmluZywgLi4uaXRlbXM6IFRbXSkgPT4gVGhlbmFibGU8VD4gPSBudWxsO1xyXG4gICAgICAgICAgICAvLyBzd2l0Y2ggKHBhcmFtcy50eXBlKSB7XHJcbiAgICAgICAgICAgIC8vICAgICBjYXNlIE1lc3NhZ2VUeXBlLkVycm9yOlxyXG4gICAgICAgICAgICAvLyAgICAgICAgIG1lc3NhZ2VGdW5jID0gV2luZG93LnNob3dFcnJvck1lc3NhZ2U7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIC8vICAgICBjYXNlIE1lc3NhZ2VUeXBlLldhcm5pbmc6XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgbWVzc2FnZUZ1bmMgPSBXaW5kb3cuc2hvd1dhcm5pbmdNZXNzYWdlO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAvLyAgICAgY2FzZSBNZXNzYWdlVHlwZS5JbmZvOlxyXG4gICAgICAgICAgICAvLyAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgLy8gICAgICAgICBtZXNzYWdlRnVuYyA9IFdpbmRvdy5zaG93SW5mb3JtYXRpb25NZXNzYWdlO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIC8vIHJldHVybiBtZXNzYWdlRnVuYyhwYXJhbXMubWVzc2FnZSwgLi4ucGFyYW1zLmFjdGlvbnMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24ub25UZWxlbWV0cnkoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5saXN0ZW4oKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5faW5pdGlhbGl6ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2luaXRpYWxpemUoKTogUHJvbWlzZTxJbml0aWFsaXplUmVzdWx0PiB7XHJcbiAgICAgICAgY29uc3QgaW5pdFBhcmFtczogSW5pdGlhbGl6ZVBhcmFtcyA9IHtcclxuICAgICAgICAgICAgcHJvY2Vzc0lkOiBwcm9jZXNzLnBpZCxcclxuICAgICAgICAgICAgcm9vdFBhdGg6IHRoaXMucm9vdFBhdGgsXHJcbiAgICAgICAgICAgIGNhcGFiaWxpdGllczogeyBoaWdobGlnaHRQcm92aWRlcjogdHJ1ZSB9LFxyXG4gICAgICAgICAgICBpbml0aWFsaXphdGlvbk9wdGlvbnM6IHRoaXMuX29wdGlvbnMuaW5pdGlhbGl6YXRpb25PcHRpb25zXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29ubmVjdGlvbi5pbml0aWFsaXplKGluaXRQYXJhbXMpXHJcbiAgICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IENsaWVudFN0YXRlLlJ1bm5pbmc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jYXBhYmlsaXRpZXMgPSA8U2VydmVyQ2FwYWJpbGl0aWVzPnJlc3VsdC5jYXBhYmlsaXRpZXM7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2NhcGFiaWxpdGllcy5leHRlbmRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhcGFiaWxpdGllcy5leHRlbmRlZCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgKGVycm9yOiBSZXNwb25zZUVycm9yPEluaXRpYWxpemVFcnJvcj4pID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yICYmIGVycm9yLmRhdGEgJiYgZXJyb3IuZGF0YS5yZXRyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFdpbmRvdy5zaG93RXJyb3JNZXNzYWdlKGVycm9yLm1lc3NhZ2UsIHsgdGl0bGU6ICdSZXRyeScsIGlkOiAncmV0cnknIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIC50aGVuKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgaWYgKGlzLmRlZmluZWQoaXRlbSkgJiYgaXRlbS5pZCA9PT0gJ3JldHJ5Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZShjb25uZWN0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBpZiAoZXJyb3IubWVzc2FnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBXaW5kb3cuc2hvd0Vycm9yTWVzc2FnZShlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0b3AoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9jb25uZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gQ2xpZW50U3RhdGUuU3RvcHBlZDtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9zdGF0ZSA9IENsaWVudFN0YXRlLlN0b3BwaW5nO1xyXG4gICAgICAgIHRoaXMuX2NsZWFuVXAoKTtcclxuICAgICAgICAvLyB1bmtvb2sgbGlzdGVuZXJzXHJcbiAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5zaHV0ZG93bigpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLmV4aXQoKTtcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gQ2xpZW50U3RhdGUuU3RvcHBlZDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9jbGVhblVwKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZGlzcG9zZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0IF9pc0Nvbm5lY3Rpb25BY3RpdmUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlID09PSBDbGllbnRTdGF0ZS5SdW5uaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZW5kUmVxdWVzdDxQLCBSLCBFPih0eXBlOiBSZXF1ZXN0VHlwZTxQLCBSLCBFPiwgcGFyYW1zOiBQKTogT2JzZXJ2YWJsZTxSPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RvU2VuZFJlcXVlc3Q8UCwgUj4odGhpcy5fY29ubmVjdGlvbiwgdHlwZSwgcGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9kb1NlbmRSZXF1ZXN0PFAsIFI+KGNvbm5lY3Rpb246IElDb25uZWN0aW9uLCB0eXBlOiB7IG1ldGhvZDogc3RyaW5nOyB9LCBwYXJhbXM6IFApOiBPYnNlcnZhYmxlPFI+IHtcclxuICAgICAgICBpZiAodGhpcy5faXNDb25uZWN0aW9uQWN0aXZlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RvY3VtZW50RGVsYXllci5mb3JjZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2ZVByb21pc2U8Uj4oKHRva2VuKSA9PiBjb25uZWN0aW9uLnNlbmRSZXF1ZXN0KDxhbnk+dHlwZSwgcGFyYW1zLCB0b2tlbikpO1xyXG4gICAgICAgICAgICAvLyByZXR1cm4gY29ubmVjdGlvbi5zZW5kUmVxdWVzdCg8YW55PnR5cGUsIHBhcmFtcywgdG9rZW4pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBPYnNlcnZhYmxlLnRocm93PFI+KG5ldyBSZXNwb25zZUVycm9yKEVycm9yQ29kZXMuSW50ZXJuYWxFcnJvciwgJ0Nvbm5lY3Rpb24gaXMgY2xvc2VkLicpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlbmROb3RpZmljYXRpb248UD4odHlwZTogTm90aWZpY2F0aW9uVHlwZTxQPiwgcGFyYW1zPzogUCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLl9pc0Nvbm5lY3Rpb25BY3RpdmUpIHtcclxuICAgICAgICAgICAgLy8gdGhpcy5fZG9jdW1lbnREZWxheWVyLmZvcmNlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uc2VuZE5vdGlmaWNhdGlvbig8YW55PnR5cGUsIHBhcmFtcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbk5vdGlmaWNhdGlvbjxQPih0eXBlOiBOb3RpZmljYXRpb25UeXBlPFA+LCBoYW5kbGVyOiBOb3RpZmljYXRpb25IYW5kbGVyPFA+KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5vbk5vdGlmaWNhdGlvbig8YW55PnR5cGUsIGhhbmRsZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvblJlcXVlc3Q8UCwgUiwgRT4odHlwZTogUmVxdWVzdFR5cGU8UCwgUiwgRT4sIGhhbmRsZXI6IFJlcXVlc3RIYW5kbGVyPFAsIFIsIEU+KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5vblJlcXVlc3QoPGFueT50eXBlLCBoYW5kbGVyKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwdWJsaWMgZ2V0IG9uVGVsZW1ldHJ5KCk6IEV2ZW50PGFueT4ge1xyXG4gICAgLy8gICAgIHJldHVybiB0aGlzLl90ZWxlbWV0cnlFbWl0dGVyLmV2ZW50O1xyXG4gICAgLy8gfVxyXG59XHJcbiJdfQ==