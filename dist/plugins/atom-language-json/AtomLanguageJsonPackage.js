"use strict";
/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
var _ = require('lodash');
var rxjs_1 = require('rxjs');
var atom_languageservices_1 = require('atom-languageservices');
var path_1 = require('path');
var ts_disposables_1 = require('ts-disposables');
var AtomLanguageJsonSettings_1 = require('./atom/AtomLanguageJsonSettings');
var AtomLanguageJsonPackage = (function () {
    function AtomLanguageJsonPackage() {
        this._associations = {};
    }
    /* tslint:disable:no-any */
    AtomLanguageJsonPackage.prototype.activate = function (settings) {
        this._disposable = new ts_disposables_1.CompositeDisposable();
        this._settings = settings instanceof AtomLanguageJsonSettings_1.AtomLanguageJsonSettings ? settings : new AtomLanguageJsonSettings_1.AtomLanguageJsonSettings(settings);
        this._stateChange = new rxjs_1.ReplaySubject(1);
    };
    /* tslint:disable-next-line:function-name */
    AtomLanguageJsonPackage.prototype['consume-atom-language-client'] = function (service) {
        this._languageService = service;
    };
    /* tslint:disable-next-line:function-name */
    AtomLanguageJsonPackage.prototype['consume-json-validation'] = function (validations) {
        var _this = this;
        if (!_.isArray(validations)) {
            validations = [validations];
        }
        _.each(validations, function (validation) {
            var fileMatch = validation.fileMatch, url = validation.url;
            if (fileMatch && url) {
                if (fileMatch.charAt(0) !== '/' && !fileMatch.match(/\w+:\/\//)) {
                    fileMatch = '/' + fileMatch;
                }
                var association = _this._associations[fileMatch];
                if (!association) {
                    association = [];
                    _this._associations[fileMatch] = association;
                }
                association.push(url);
            }
        });
        if (this._client) {
            this._client.sendNotification({ method: 'json/schemaAssociations' }, this._associations);
        }
    };
    /* tslint:disable-next-line:function-name */
    AtomLanguageJsonPackage.prototype['provide-atom-language'] = function () {
        var _this = this;
        // The server is implemented in node
        var serverModule = path_1.join(__dirname, 'server/server.js');
        var serverOptions = {
            run: { module: serverModule, transport: atom_languageservices_1.TransportKind.ipc },
            debug: { module: serverModule, transport: atom_languageservices_1.TransportKind.ipc }
        };
        return {
            clientOptions: {
                diagnosticCollectionName: 'json',
                documentSelector: 'json',
                errorHandler: {
                    error: function (error, message, count) {
                        console.error(error, message, count);
                        return atom_languageservices_1.ErrorAction.Continue;
                    },
                    closed: function () {
                        console.error('closed');
                        return atom_languageservices_1.CloseAction.Restart;
                    }
                },
                outputChannelName: 'json',
                initializationOptions: {},
                synchronize: {
                    extensionSelector: [
                        '.json',
                        '.bowerrc',
                        '.jshintrc',
                        '.jscsrc',
                        '.eslintrc',
                        '.babelrc',
                        '.webmanifest'
                    ]
                }
            },
            serverOptions: serverOptions,
            onConnected: function (client) {
                _this._client = client;
                _this._client.sendNotification({ method: 'json/schemaAssociations' }, _this._associations);
            },
            dispose: function () { }
        };
    };
    /* tslint:disable-next-line:no-any */
    AtomLanguageJsonPackage.deserialize = function (state) {
        return new AtomLanguageJsonSettings_1.AtomLanguageJsonSettings(state);
    };
    AtomLanguageJsonPackage.prototype.serialize = function () {
        return this._settings.serialize(AtomLanguageJsonPackage);
    };
    AtomLanguageJsonPackage.prototype.deactivate = function () {
        this._disposable.dispose();
    };
    Object.defineProperty(AtomLanguageJsonPackage, "version", {
        get: function () { return 1; },
        enumerable: true,
        configurable: true
    });
    return AtomLanguageJsonPackage;
}());
exports.AtomLanguageJsonPackage = AtomLanguageJsonPackage;
atom.deserializers.add(AtomLanguageJsonPackage);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXRvbUxhbmd1YWdlSnNvblBhY2thZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9wbHVnaW5zL2F0b20tbGFuZ3VhZ2UtanNvbi9BdG9tTGFuZ3VhZ2VKc29uUGFja2FnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRztBQUNILElBQVksQ0FBQyxXQUFNLFFBQVEsQ0FBQyxDQUFBO0FBQzVCLHFCQUE4QixNQUFNLENBQUMsQ0FBQTtBQUNyQyxzQ0FBc0osdUJBQXVCLENBQUMsQ0FBQTtBQUM5SyxxQkFBcUIsTUFBTSxDQUFDLENBQUE7QUFDNUIsK0JBQW9DLGdCQUFnQixDQUFDLENBQUE7QUFFckQseUNBQW9FLGlDQUFpQyxDQUFDLENBQUE7QUFFdEc7SUFBQTtRQU1ZLGtCQUFhLEdBQTRCLEVBQUUsQ0FBQztJQW1HeEQsQ0FBQztJQWpHRywyQkFBMkI7SUFDcEIsMENBQVEsR0FBZixVQUFnQixRQUFtQztRQUMvQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksb0NBQW1CLEVBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsWUFBWSxtREFBd0IsR0FBRyxRQUFRLEdBQUcsSUFBSSxtREFBd0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNsSCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksb0JBQWEsQ0FBVSxDQUFDLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQsNENBQTRDO0lBQ3JDLGtDQUFDLDhCQUE4QixDQUFDLEdBQXZDLFVBQXdDLE9BQXlCO1FBQzdELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxPQUFPLENBQUM7SUFDcEMsQ0FBQztJQUVELDRDQUE0QztJQUNyQyxrQ0FBQyx5QkFBeUIsQ0FBQyxHQUFsQyxVQUFtQyxXQUFnRDtRQUFuRixpQkFzQkM7UUFyQkcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZ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QUFXLENBQUM7U0FDdEIsQ0FBQztJQUNOLENBQUM7SUFFRCxxQ0FBcUM7SUFDdkIsbUNBQVcsR0FBekIsVUFBMEIsS0FBZ0M7UUFDdEQsTUFBTSxDQUFDLElBQUksbURBQXdCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVNLDJDQUFTLEdBQWhCO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVNLDRDQUFVLEdBQWpCO1FBQ0ksSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUMvQixDQUFDO0lBRUQsc0JBQWtCLGtDQUFPO2FBQXpCLGNBQThCLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUM3Qyw4QkFBQztBQUFELENBQUMsQUF6R0QsSUF5R0M7QUF6R1ksK0JBQXVCLDBCQXlHbkMsQ0FBQTtBQUVELElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogIEBsaWNlbnNlICAgTUlUXHJcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IFJlcGxheVN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgQ2xvc2VBY3Rpb24sIEVycm9yQWN0aW9uLCBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCwgSUxhbmd1YWdlUHJvdG9jb2xTZXJ2ZXJPcHRpb25zLCBJTGFuZ3VhZ2VQcm92aWRlciwgSUxhbmd1YWdlU2VydmljZSwgVHJhbnNwb3J0S2luZCB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcclxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ3RzLWRpc3Bvc2FibGVzJztcclxuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJ3ZzY29kZS1qc29ucnBjJztcclxuaW1wb3J0IHsgQXRvbUxhbmd1YWdlSnNvblNldHRpbmdzLCBJQXRvbUxhbmd1YWdlSnNvblNldHRpbmdzIH0gZnJvbSAnLi9hdG9tL0F0b21MYW5ndWFnZUpzb25TZXR0aW5ncyc7XHJcblxyXG5leHBvcnQgY2xhc3MgQXRvbUxhbmd1YWdlSnNvblBhY2thZ2UgaW1wbGVtZW50cyBJQXRvbVBhY2thZ2U8SUF0b21MYW5ndWFnZUpzb25TZXR0aW5ncz4ge1xyXG4gICAgcHJpdmF0ZSBfZGlzcG9zYWJsZTogQ29tcG9zaXRlRGlzcG9zYWJsZTtcclxuICAgIHByaXZhdGUgX3NldHRpbmdzOiBBdG9tTGFuZ3VhZ2VKc29uU2V0dGluZ3M7XHJcbiAgICBwcml2YXRlIF9zdGF0ZUNoYW5nZTogUmVwbGF5U3ViamVjdDxib29sZWFuPjtcclxuICAgIHByaXZhdGUgX2xhbmd1YWdlU2VydmljZTogSUxhbmd1YWdlU2VydmljZTtcclxuICAgIHByaXZhdGUgX2NsaWVudDogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQ7XHJcbiAgICBwcml2YXRlIF9hc3NvY2lhdGlvbnM6IEpzb24uU2NoZW1hQXNzb2NpYXRpb25zID0ge307XHJcblxyXG4gICAgLyogdHNsaW50OmRpc2FibGU6bm8tYW55ICovXHJcbiAgICBwdWJsaWMgYWN0aXZhdGUoc2V0dGluZ3M6IElBdG9tTGFuZ3VhZ2VKc29uU2V0dGluZ3MpIHtcclxuICAgICAgICB0aGlzLl9kaXNwb3NhYmxlID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcclxuICAgICAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzIGluc3RhbmNlb2YgQXRvbUxhbmd1YWdlSnNvblNldHRpbmdzID8gc2V0dGluZ3MgOiBuZXcgQXRvbUxhbmd1YWdlSnNvblNldHRpbmdzKHNldHRpbmdzKTtcclxuICAgICAgICB0aGlzLl9zdGF0ZUNoYW5nZSA9IG5ldyBSZXBsYXlTdWJqZWN0PGJvb2xlYW4+KDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpmdW5jdGlvbi1uYW1lICovXHJcbiAgICBwdWJsaWMgWydjb25zdW1lLWF0b20tbGFuZ3VhZ2UtY2xpZW50J10oc2VydmljZTogSUxhbmd1YWdlU2VydmljZSkge1xyXG4gICAgICAgIHRoaXMuX2xhbmd1YWdlU2VydmljZSA9IHNlcnZpY2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmZ1bmN0aW9uLW5hbWUgKi9cclxuICAgIHB1YmxpYyBbJ2NvbnN1bWUtanNvbi12YWxpZGF0aW9uJ10odmFsaWRhdGlvbnM6IEpzb24uVmFsaWRhdGlvbiB8IEpzb24uVmFsaWRhdGlvbltdKSB7XHJcbiAgICAgICAgaWYgKCFfLmlzQXJyYXkodmFsaWRhdGlvbnMpKSB7XHJcbiAgICAgICAgICAgIHZhbGlkYXRpb25zID0gW3ZhbGlkYXRpb25zXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXy5lYWNoKHZhbGlkYXRpb25zLCB2YWxpZGF0aW9uID0+IHtcclxuICAgICAgICAgICAgbGV0IHtmaWxlTWF0Y2gsIHVybH0gPSB2YWxpZGF0aW9uO1xyXG4gICAgICAgICAgICBpZiAoZmlsZU1hdGNoICYmIHVybCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGZpbGVNYXRjaC5jaGFyQXQoMCkgIT09ICcvJyAmJiAhZmlsZU1hdGNoLm1hdGNoKC9cXHcrOlxcL1xcLy8pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsZU1hdGNoID0gJy8nICsgZmlsZU1hdGNoO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGV0IGFzc29jaWF0aW9uID0gdGhpcy5fYXNzb2NpYXRpb25zW2ZpbGVNYXRjaF07XHJcbiAgICAgICAgICAgICAgICBpZiAoIWFzc29jaWF0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXNzb2NpYXRpb24gPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hc3NvY2lhdGlvbnNbZmlsZU1hdGNoXSA9IGFzc29jaWF0aW9uO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYXNzb2NpYXRpb24ucHVzaCh1cmwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9jbGllbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5fY2xpZW50LnNlbmROb3RpZmljYXRpb24oeyBtZXRob2Q6ICdqc29uL3NjaGVtYUFzc29jaWF0aW9ucycgfSwgdGhpcy5fYXNzb2NpYXRpb25zKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmZ1bmN0aW9uLW5hbWUgKi9cclxuICAgIHB1YmxpYyBbJ3Byb3ZpZGUtYXRvbS1sYW5ndWFnZSddKCk6IElMYW5ndWFnZVByb3ZpZGVyIHtcclxuICAgICAgICAvLyBUaGUgc2VydmVyIGlzIGltcGxlbWVudGVkIGluIG5vZGVcclxuICAgICAgICBjb25zdCBzZXJ2ZXJNb2R1bGUgPSBqb2luKF9fZGlybmFtZSwgJ3NlcnZlci9zZXJ2ZXIuanMnKTtcclxuICAgICAgICBjb25zdCBzZXJ2ZXJPcHRpb25zOiBJTGFuZ3VhZ2VQcm90b2NvbFNlcnZlck9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHJ1bjogeyBtb2R1bGU6IHNlcnZlck1vZHVsZSwgdHJhbnNwb3J0OiBUcmFuc3BvcnRLaW5kLmlwYyB9LFxyXG4gICAgICAgICAgICBkZWJ1ZzogeyBtb2R1bGU6IHNlcnZlck1vZHVsZSwgdHJhbnNwb3J0OiBUcmFuc3BvcnRLaW5kLmlwYyB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIDxJTGFuZ3VhZ2VQcm92aWRlcj57XHJcbiAgICAgICAgICAgIGNsaWVudE9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgIGRpYWdub3N0aWNDb2xsZWN0aW9uTmFtZTogJ2pzb24nLFxyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnRTZWxlY3RvcjogJ2pzb24nLFxyXG4gICAgICAgICAgICAgICAgZXJyb3JIYW5kbGVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IChlcnJvcjogRXJyb3IsIG1lc3NhZ2U6IE1lc3NhZ2UsIGNvdW50OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvciwgbWVzc2FnZSwgY291bnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gRXJyb3JBY3Rpb24uQ29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBjbG9zZWQoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Nsb3NlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gQ2xvc2VBY3Rpb24uUmVzdGFydDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgb3V0cHV0Q2hhbm5lbE5hbWU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgIGluaXRpYWxpemF0aW9uT3B0aW9uczoge30sXHJcbiAgICAgICAgICAgICAgICBzeW5jaHJvbml6ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGV4dGVuc2lvblNlbGVjdG9yOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICcuanNvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICcuYm93ZXJyYycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICcuanNoaW50cmMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnLmpzY3NyYycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICcuZXNsaW50cmMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnLmJhYmVscmMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnLndlYm1hbmlmZXN0J1xyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2VydmVyT3B0aW9ucyxcclxuICAgICAgICAgICAgb25Db25uZWN0ZWQ6IChjbGllbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NsaWVudCA9IGNsaWVudDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NsaWVudC5zZW5kTm90aWZpY2F0aW9uKHsgbWV0aG9kOiAnanNvbi9zY2hlbWFBc3NvY2lhdGlvbnMnIH0sIHRoaXMuX2Fzc29jaWF0aW9ucyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRpc3Bvc2UoKSB7IC8qICovIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnkgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZGVzZXJpYWxpemUoc3RhdGU6IElBdG9tTGFuZ3VhZ2VKc29uU2V0dGluZ3MpIHtcclxuICAgICAgICByZXR1cm4gbmV3IEF0b21MYW5ndWFnZUpzb25TZXR0aW5ncyhzdGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlcmlhbGl6ZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2V0dGluZ3Muc2VyaWFsaXplKEF0b21MYW5ndWFnZUpzb25QYWNrYWdlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVhY3RpdmF0ZSgpIHtcclxuICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLmRpc3Bvc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCB2ZXJzaW9uKCkgeyByZXR1cm4gMTsgfVxyXG59XHJcblxyXG5hdG9tLmRlc2VyaWFsaXplcnMuYWRkKEF0b21MYW5ndWFnZUpzb25QYWNrYWdlKTtcclxuIl19