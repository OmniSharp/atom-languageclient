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
var atom_languageservices_1 = require('atom-languageservices');
var decorators_1 = require('atom-languageservices/decorators');
var protocol_1 = require('atom-languageservices/protocol');
var types_1 = require('atom-languageservices/types');
var ts_disposables_1 = require('ts-disposables');
var vscode_jsonrpc_1 = require('vscode-jsonrpc');
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
            capabilities: {},
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
    LanguageProtocolClient.prototype.sendRequest = function (type, params, token) {
        return this._doSendRequest(this._connection, type, params, token);
    };
    LanguageProtocolClient.prototype._doSendRequest = function (connection, type, params, token) {
        if (this._isConnectionActive) {
            this._documentDelayer.force();
            return connection.sendRequest(type, params, token);
        }
        else {
            return Promise.reject(new vscode_jsonrpc_1.ResponseError(vscode_jsonrpc_1.ErrorCodes.InternalError, 'Connection is closed.'));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFuZ3VhZ2VQcm90b2NvbENsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcm90b2NvbC9MYW5ndWFnZVByb3RvY29sQ2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCwyQkFBMkI7QUFDM0Isc0NBQTBJLHVCQUF1QixDQUFDLENBQUE7QUFDbEssMkJBQXVCLGtDQUFrQyxDQUFDLENBQUE7QUFDMUQseUJBQW1DLGdDQUFnQyxDQUFDLENBQUE7QUFDcEUsc0JBQWlGLDZCQUE2QixDQUFDLENBQUE7QUFFL0csK0JBQTJDLGdCQUFnQixDQUFDLENBQUE7QUFDNUQsK0JBQWlJLGdCQUFnQixDQUFDLENBQUE7QUFDbEosMkJBQTRCLGNBQWMsQ0FBQyxDQUFBO0FBRTNDO0lBQTRDLDBDQUFjO0lBY3RELGdDQUM4QixlQUFpQyxFQUN0QyxVQUF1QixFQUNKLE9BQXVDLEVBQ3RELGNBQStCLEVBQzlCLGVBQWlDO1FBbkJuRSxpQkEyTEM7UUF2S08saUJBQU8sQ0FBQztRQUNSLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxlQUFlLENBQUM7UUFDeEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7UUFDOUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7UUFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxtQ0FBVyxDQUFDLE9BQU8sQ0FBQztRQUNsQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsZUFBZSxDQUFDO1FBRXhDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUNoQixJQUFJLENBQUMsZ0JBQWdCLEVBQ3JCLDJCQUFVLENBQUMsTUFBTSxDQUFDO1lBQ2QsS0FBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2hCLENBQUMsQ0FBQyxDQUNMLENBQUM7SUFDTixDQUFDO0lBekJELHNCQUFXLHlDQUFLO2FBQWhCLGNBQXFCLE1BQU0sQ0FBQyxJQUFJ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IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG4vKiB0c2xpbnQ6ZGlzYWJsZTpuby1hbnkgKi9cclxuaW1wb3J0IHsgQ2xpZW50U3RhdGUsIElEb2N1bWVudERlbGF5ZXIsIElMYW5ndWFnZVByb3RvY29sQ2xpZW50LCBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudE9wdGlvbnMsIElQcm9qZWN0UHJvdmlkZXIsIElTeW5jRXhwcmVzc2lvbiB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCB7IGluamVjdCB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9kZWNvcmF0b3JzJztcclxuaW1wb3J0IHsgU2hvd01lc3NhZ2VSZXF1ZXN0IH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL3Byb3RvY29sJztcclxuaW1wb3J0IHsgSW5pdGlhbGl6ZUVycm9yLCBJbml0aWFsaXplUGFyYW1zLCBJbml0aWFsaXplUmVzdWx0LCBNZXNzYWdlVHlwZSB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy90eXBlcyc7XHJcbmltcG9ydCB7IFNlcnZlckNhcGFiaWxpdGllcyB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy90eXBlcy1leHRlbmRlZCc7XHJcbmltcG9ydCB7IERpc3Bvc2FibGUsIERpc3Bvc2FibGVCYXNlIH0gZnJvbSAndHMtZGlzcG9zYWJsZXMnO1xyXG5pbXBvcnQgeyBDYW5jZWxsYXRpb25Ub2tlbiwgRXJyb3JDb2RlcywgTm90aWZpY2F0aW9uSGFuZGxlciwgTm90aWZpY2F0aW9uVHlwZSwgUmVxdWVzdEhhbmRsZXIsIFJlcXVlc3RUeXBlLCBSZXNwb25zZUVycm9yIH0gZnJvbSAndnNjb2RlLWpzb25ycGMnO1xyXG5pbXBvcnQgeyBJQ29ubmVjdGlvbiB9IGZyb20gJy4vQ29ubmVjdGlvbic7XHJcblxyXG5leHBvcnQgY2xhc3MgTGFuZ3VhZ2VQcm90b2NvbENsaWVudCBleHRlbmRzIERpc3Bvc2FibGVCYXNlIGltcGxlbWVudHMgSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQge1xyXG4gICAgcHJpdmF0ZSBfY2FwYWJpbGl0aWVzOiBTZXJ2ZXJDYXBhYmlsaXRpZXM7XHJcbiAgICBwcml2YXRlIF9jb25uZWN0aW9uOiBJQ29ubmVjdGlvbjtcclxuICAgIHByaXZhdGUgX3Byb2plY3RQcm92aWRlcjogSVByb2plY3RQcm92aWRlcjtcclxuICAgIHByaXZhdGUgX3N0YXRlOiBDbGllbnRTdGF0ZTtcclxuICAgIHByaXZhdGUgX29wdGlvbnM6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50T3B0aW9ucztcclxuICAgIHByaXZhdGUgX2RvY3VtZW50RGVsYXllcjogSURvY3VtZW50RGVsYXllcjtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IHN0YXRlKCkgeyByZXR1cm4gdGhpcy5fc3RhdGU7IH1cclxuICAgIHB1YmxpYyBnZXQgY2FwYWJpbGl0aWVzKCkgeyByZXR1cm4gdGhpcy5fY2FwYWJpbGl0aWVzOyB9XHJcbiAgICBwdWJsaWMgZ2V0IG9wdGlvbnMoKSB7IHJldHVybiB0aGlzLl9vcHRpb25zOyB9XHJcbiAgICBwdWJsaWMgZ2V0IG5hbWUoKSB7IHJldHVybiB0aGlzLl9vcHRpb25zLmRpYWdub3N0aWNDb2xsZWN0aW9uTmFtZSB8fCB0aGlzLl9vcHRpb25zLm91dHB1dENoYW5uZWxOYW1lIHx8ICdsYW5ndWFnZXByb3RvY29sJzsgfVxyXG4gICAgcHVibGljIGdldCByb290UGF0aCgpIHsgcmV0dXJuIHRoaXMuX3Byb2plY3RQcm92aWRlci5nZXRQYXRocygpWzBdIHx8IHByb2Nlc3MuY3dkKCk7IH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBAaW5qZWN0KElQcm9qZWN0UHJvdmlkZXIpIHByb2plY3RQcm92aWRlcjogSVByb2plY3RQcm92aWRlcixcclxuICAgICAgICBAaW5qZWN0KElDb25uZWN0aW9uKSBjb25uZWN0aW9uOiBJQ29ubmVjdGlvbixcclxuICAgICAgICBAaW5qZWN0KElMYW5ndWFnZVByb3RvY29sQ2xpZW50T3B0aW9ucykgb3B0aW9uczogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnRPcHRpb25zLFxyXG4gICAgICAgIEBpbmplY3QoSVN5bmNFeHByZXNzaW9uKSBzeW5jRXhwcmVzc2lvbjogSVN5bmNFeHByZXNzaW9uLFxyXG4gICAgICAgIEBpbmplY3QoSURvY3VtZW50RGVsYXllcikgZG9jdW1lbnREZWxheWVyOiBJRG9jdW1lbnREZWxheWVyKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9wcm9qZWN0UHJvdmlkZXIgPSBwcm9qZWN0UHJvdmlkZXI7XHJcbiAgICAgICAgdGhpcy5fY29ubmVjdGlvbiA9IGNvbm5lY3Rpb247XHJcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgICAgICAgdGhpcy5fc3RhdGUgPSBDbGllbnRTdGF0ZS5Jbml0aWFsO1xyXG4gICAgICAgIHRoaXMuX2RvY3VtZW50RGVsYXllciA9IGRvY3VtZW50RGVsYXllcjtcclxuXHJcbiAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQoXHJcbiAgICAgICAgICAgIHRoaXMuX2RvY3VtZW50RGVsYXllcixcclxuICAgICAgICAgICAgRGlzcG9zYWJsZS5jcmVhdGUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnQoKSB7XHJcbiAgICAgICAgdGhpcy5fc3RhdGUgPSBDbGllbnRTdGF0ZS5TdGFydGluZztcclxuICAgICAgICB0aGlzLl9jb25uZWN0aW9uLm9uTG9nTWVzc2FnZSgobWVzc2FnZSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgb2JqOiBhbnkgPSBtZXNzYWdlLm1lc3NhZ2U7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBvYmogPSBKU09OLnBhcnNlKG9iaik7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHsgfVxyXG4gICAgICAgICAgICBzd2l0Y2ggKG1lc3NhZ2UudHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBNZXNzYWdlVHlwZS5FcnJvcjpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBbRXJyb3JdYCwgb2JqKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgTWVzc2FnZVR5cGUuV2FybmluZzpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYFtXYXJuXWAsIG9iaik7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE1lc3NhZ2VUeXBlLkluZm86XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5pbmZvKGBbSW5mb11gLCBvYmopO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhtZXNzYWdlLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5vblNob3dNZXNzYWdlKChtZXNzYWdlKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIHN3aXRjaCAobWVzc2FnZS50eXBlKSB7XHJcbiAgICAgICAgICAgIC8vICAgICBjYXNlIE1lc3NhZ2VUeXBlLkVycm9yOlxyXG4gICAgICAgICAgICAvLyAgICAgICAgIFdpbmRvdy5zaG93RXJyb3JNZXNzYWdlKG1lc3NhZ2UubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIC8vICAgICBjYXNlIE1lc3NhZ2VUeXBlLldhcm5pbmc6XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgV2luZG93LnNob3dXYXJuaW5nTWVzc2FnZShtZXNzYWdlLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAvLyAgICAgY2FzZSBNZXNzYWdlVHlwZS5JbmZvOlxyXG4gICAgICAgICAgICAvLyAgICAgICAgIFdpbmRvdy5zaG93SW5mb3JtYXRpb25NZXNzYWdlKG1lc3NhZ2UubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIC8vICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAvLyAgICAgICAgIFdpbmRvdy5zaG93SW5mb3JtYXRpb25NZXNzYWdlKG1lc3NhZ2UubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9jb25uZWN0aW9uLm9uUmVxdWVzdChTaG93TWVzc2FnZVJlcXVlc3QudHlwZSwgKHBhcmFtcykgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gPGFueT5udWxsO1xyXG4gICAgICAgICAgICAvLyBsZXQgbWVzc2FnZUZ1bmM6IDxUIGV4dGVuZHMgTWVzc2FnZUl0ZW0+KG1lc3NhZ2U6IHN0cmluZywgLi4uaXRlbXM6IFRbXSkgPT4gVGhlbmFibGU8VD4gPSBudWxsO1xyXG4gICAgICAgICAgICAvLyBzd2l0Y2ggKHBhcmFtcy50eXBlKSB7XHJcbiAgICAgICAgICAgIC8vICAgICBjYXNlIE1lc3NhZ2VUeXBlLkVycm9yOlxyXG4gICAgICAgICAgICAvLyAgICAgICAgIG1lc3NhZ2VGdW5jID0gV2luZG93LnNob3dFcnJvck1lc3NhZ2U7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIC8vICAgICBjYXNlIE1lc3NhZ2VUeXBlLldhcm5pbmc6XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgbWVzc2FnZUZ1bmMgPSBXaW5kb3cuc2hvd1dhcm5pbmdNZXNzYWdlO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAvLyAgICAgY2FzZSBNZXNzYWdlVHlwZS5JbmZvOlxyXG4gICAgICAgICAgICAvLyAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgLy8gICAgICAgICBtZXNzYWdlRnVuYyA9IFdpbmRvdy5zaG93SW5mb3JtYXRpb25NZXNzYWdlO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIC8vIHJldHVybiBtZXNzYWdlRnVuYyhwYXJhbXMubWVzc2FnZSwgLi4ucGFyYW1zLmFjdGlvbnMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24ub25UZWxlbWV0cnkoKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5saXN0ZW4oKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5faW5pdGlhbGl6ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2luaXRpYWxpemUoKTogUHJvbWlzZTxJbml0aWFsaXplUmVzdWx0PiB7XHJcbiAgICAgICAgY29uc3QgaW5pdFBhcmFtczogSW5pdGlhbGl6ZVBhcmFtcyA9IHtcclxuICAgICAgICAgICAgcHJvY2Vzc0lkOiBwcm9jZXNzLnBpZCxcclxuICAgICAgICAgICAgcm9vdFBhdGg6IHRoaXMucm9vdFBhdGgsXHJcbiAgICAgICAgICAgIGNhcGFiaWxpdGllczoge30sXHJcbiAgICAgICAgICAgIGluaXRpYWxpemF0aW9uT3B0aW9uczogdGhpcy5fb3B0aW9ucy5pbml0aWFsaXphdGlvbk9wdGlvbnNcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb25uZWN0aW9uLmluaXRpYWxpemUoaW5pdFBhcmFtcylcclxuICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgIChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gQ2xpZW50U3RhdGUuUnVubmluZztcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhcGFiaWxpdGllcyA9IDxTZXJ2ZXJDYXBhYmlsaXRpZXM+cmVzdWx0LmNhcGFiaWxpdGllcztcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fY2FwYWJpbGl0aWVzLmV4dGVuZGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FwYWJpbGl0aWVzLmV4dGVuZGVkID0ge307XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAoZXJyb3I6IFJlc3BvbnNlRXJyb3I8SW5pdGlhbGl6ZUVycm9yPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IgJiYgZXJyb3IuZGF0YSAmJiBlcnJvci5kYXRhLnJldHJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gV2luZG93LnNob3dFcnJvck1lc3NhZ2UoZXJyb3IubWVzc2FnZSwgeyB0aXRsZTogJ1JldHJ5JywgaWQ6ICdyZXRyeScgfSlcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgLnRoZW4oaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBpZiAoaXMuZGVmaW5lZChpdGVtKSAmJiBpdGVtLmlkID09PSAncmV0cnknKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplKGNvbm5lY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIChlcnJvci5tZXNzYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIFdpbmRvdy5zaG93RXJyb3JNZXNzYWdlKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLnN0b3AoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RvcCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2Nvbm5lY3Rpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSBDbGllbnRTdGF0ZS5TdG9wcGVkO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3N0YXRlID0gQ2xpZW50U3RhdGUuU3RvcHBpbmc7XHJcbiAgICAgICAgdGhpcy5fY2xlYW5VcCgpO1xyXG4gICAgICAgIC8vIHVua29vayBsaXN0ZW5lcnNcclxuICAgICAgICB0aGlzLl9jb25uZWN0aW9uLnNodXRkb3duKCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uZXhpdCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLmRpc3Bvc2UoKTtcclxuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSBDbGllbnRTdGF0ZS5TdG9wcGVkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2NsZWFuVXAoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5kaXNwb3NlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXQgX2lzQ29ubmVjdGlvbkFjdGl2ZSgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3RhdGUgPT09IENsaWVudFN0YXRlLlJ1bm5pbmc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlbmRSZXF1ZXN0PFAsIFIsIEU+KHR5cGU6IFJlcXVlc3RUeXBlPFAsIFIsIEU+LCBwYXJhbXM6IFAsIHRva2VuPzogQ2FuY2VsbGF0aW9uVG9rZW4pOiBUaGVuYWJsZTxSPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RvU2VuZFJlcXVlc3QodGhpcy5fY29ubmVjdGlvbiwgdHlwZSwgcGFyYW1zLCB0b2tlbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZG9TZW5kUmVxdWVzdDxQLCBSPihjb25uZWN0aW9uOiBJQ29ubmVjdGlvbiwgdHlwZTogeyBtZXRob2Q6IHN0cmluZzsgfSwgcGFyYW1zOiBQLCB0b2tlbj86IENhbmNlbGxhdGlvblRva2VuKTogVGhlbmFibGU8Uj4ge1xyXG4gICAgICAgIGlmICh0aGlzLl9pc0Nvbm5lY3Rpb25BY3RpdmUpIHtcclxuICAgICAgICAgICAgdGhpcy5fZG9jdW1lbnREZWxheWVyLmZvcmNlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBjb25uZWN0aW9uLnNlbmRSZXF1ZXN0KDxhbnk+dHlwZSwgcGFyYW1zLCB0b2tlbik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0PFI+KG5ldyBSZXNwb25zZUVycm9yKEVycm9yQ29kZXMuSW50ZXJuYWxFcnJvciwgJ0Nvbm5lY3Rpb24gaXMgY2xvc2VkLicpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlbmROb3RpZmljYXRpb248UD4odHlwZTogTm90aWZpY2F0aW9uVHlwZTxQPiwgcGFyYW1zPzogUCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLl9pc0Nvbm5lY3Rpb25BY3RpdmUpIHtcclxuICAgICAgICAgICAgLy8gdGhpcy5fZG9jdW1lbnREZWxheWVyLmZvcmNlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uc2VuZE5vdGlmaWNhdGlvbig8YW55PnR5cGUsIHBhcmFtcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbk5vdGlmaWNhdGlvbjxQPih0eXBlOiBOb3RpZmljYXRpb25UeXBlPFA+LCBoYW5kbGVyOiBOb3RpZmljYXRpb25IYW5kbGVyPFA+KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5vbk5vdGlmaWNhdGlvbig8YW55PnR5cGUsIGhhbmRsZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvblJlcXVlc3Q8UCwgUiwgRT4odHlwZTogUmVxdWVzdFR5cGU8UCwgUiwgRT4sIGhhbmRsZXI6IFJlcXVlc3RIYW5kbGVyPFAsIFIsIEU+KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5vblJlcXVlc3QoPGFueT50eXBlLCBoYW5kbGVyKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwdWJsaWMgZ2V0IG9uVGVsZW1ldHJ5KCk6IEV2ZW50PGFueT4ge1xyXG4gICAgLy8gICAgIHJldHVybiB0aGlzLl90ZWxlbWV0cnlFbWl0dGVyLmV2ZW50O1xyXG4gICAgLy8gfVxyXG59XHJcbiJdfQ==