"use strict";
var rxjs_1 = require('rxjs');
var atom_languageservices_1 = require('atom-languageservices');
var path_1 = require('path');
var ts_disposables_1 = require('ts-disposables');
var AtomLanguageCsharpSettings_1 = require('./atom/AtomLanguageCsharpSettings');
var AtomLanguageCsharpPackage = (function () {
    function AtomLanguageCsharpPackage() {
    }
    /* tslint:disable:no-any */
    AtomLanguageCsharpPackage.prototype.activate = function (settings) {
        this._disposable = new ts_disposables_1.CompositeDisposable();
        this._settings = settings instanceof AtomLanguageCsharpSettings_1.AtomLanguageCsharpSettings ? settings : new AtomLanguageCsharpSettings_1.AtomLanguageCsharpSettings(settings);
        this._stateChange = new rxjs_1.ReplaySubject(1);
    };
    /* tslint:disable-next-line:function-name */
    AtomLanguageCsharpPackage.prototype['consume-atom-language-client'] = function (service) {
        this._languageService = service;
    };
    /* tslint:disable-next-line:function-name */
    AtomLanguageCsharpPackage.prototype['provide-atom-language'] = function () {
        var serverModule = path_1.join(__dirname, 'node_modules/omnisharp-client/languageserver/server.js');
        var serverOptions = {
            run: { module: serverModule, transport: atom_languageservices_1.TransportKind.stdio },
            debug: { module: serverModule, transport: atom_languageservices_1.TransportKind.stdio }
        };
        return {
            clientOptions: {
                diagnosticCollectionName: 'c#',
                documentSelector: 'c#',
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
                outputChannelName: 'c#',
                initializationOptions: {},
                synchronize: {
                    extensionSelector: ['.cs']
                }
            },
            serverOptions: serverOptions,
            dispose: function () { }
        };
    };
    /* tslint:disable-next-line:no-any */
    AtomLanguageCsharpPackage.deserialize = function (state) {
        return new AtomLanguageCsharpSettings_1.AtomLanguageCsharpSettings(state);
    };
    AtomLanguageCsharpPackage.prototype.serialize = function () {
        return this._settings.serialize(AtomLanguageCsharpPackage);
    };
    AtomLanguageCsharpPackage.prototype.deactivate = function () {
        this._disposable.dispose();
    };
    Object.defineProperty(AtomLanguageCsharpPackage, "version", {
        get: function () { return 1; },
        enumerable: true,
        configurable: true
    });
    return AtomLanguageCsharpPackage;
}());
exports.AtomLanguageCsharpPackage = AtomLanguageCsharpPackage;
atom.deserializers.add(AtomLanguageCsharpPackage);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXRvbUxhbmd1YWdlQ3NoYXJwUGFja2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3BsdWdpbnMvYXRvbS1sYW5ndWFnZS1jc2hhcnAvQXRvbUxhbmd1YWdlQ3NoYXJwUGFja2FnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEscUJBQThCLE1BQU0sQ0FBQyxDQUFBO0FBQ3JDLHNDQUE2SCx1QkFBdUIsQ0FBQyxDQUFBO0FBQ3JKLHFCQUFxQixNQUFNLENBQUMsQ0FBQTtBQUM1QiwrQkFBb0MsZ0JBQWdCLENBQUMsQ0FBQTtBQUVyRCwyQ0FBd0UsbUNBQW1DLENBQUMsQ0FBQTtBQUU1RztJQUFBO0lBaUVBLENBQUM7SUEzREcsMkJBQTJCO0lBQ3BCLDRDQUFRLEdBQWYsVUFBZ0IsUUFBcUM7UUFDakQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLG9DQUFtQixFQUFFLENBQUM7UUFDN0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLFlBQVksdURBQTBCLEdBQUcsUUFBUSxHQUFHLElBQUksdURBQTBCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdEgsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLG9CQUFhLENBQVUsQ0FBQyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVELDRDQUE0QztJQUNyQyxvQ0FBQyw4QkFBOEIsQ0FBQyxHQUF2QyxVQUF3QyxPQUF5QjtRQUM3RCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDO0lBQ3BDLENBQUM7SUFFRCw0Q0FBNEM7SUFDckMsb0NBQUMsdUJBQXVCLENBQUMsR0FBaEM7UUFDSSxJQUFNLFlBQVksR0FBRyxXQUFJLENBQUMsU0FBUyxFQUFFLHdEQUF3RCxDQUFDLENBQUM7UUFDL0YsSUFBTSxhQUFhLEdBQW1DO1lBQ2xELEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLHFDQUFhLENBQUMsS0FBSyxFQUFFO1lBQzdELEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLHFDQUFhLENBQUMsS0FBSyxFQUFFO1NBQ2xFLENBQUM7UUFFRixNQUFNLENBQW9CO1lBQ3RCLGFBQWEsRUFBRTtnQkFDWCx3QkFBd0IsRUFBRSxJQUFJO2dCQUM5QixnQkFBZ0IsRUFBRSxJQUFJO2dCQUN0QixZQUFZLEVBQUU7b0JBQ1YsS0FBSyxFQUFFLFVBQUMsS0FBWSxFQUFFLE9BQWdCLEVBQUUsS0FBYTt3QkFDakQsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO3dCQUNyQyxNQUFNLENBQUMsbUNBQVcsQ0FBQyxRQUFRLENBQUM7b0JBQ2hDLENBQUM7b0JBQ0QsTUFBTTt3QkFDRixPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUN4QixNQUFNLENBQUMsbUNBQVcsQ0FBQyxPQUFPLENBQUM7b0JBQy9CLENBQUM7aUJBQ0o7Z0JBQ0QsaUJBQWlCLEVBQUUsSUFBSTtnQkFDdkIscUJBQXFCLEVBQUUsRUFBRTtnQkFDekIsV0FBVyxFQUFFO29CQUNULGlCQUFpQixFQUFFLENBQUMsS0FBSyxDQUFDO2lCQUM3QjthQUNKO1lBQ0QsNEJBQWE7WUFDYixPQUFPLGdCQUFXLENBQUM7U0FDdEIsQ0FBQztJQUNOLENBQUM7SUFFRCxxQ0FBcUM7SUFDdkIscUNBQVcsR0FBekIsVUFBMEIsS0FBa0M7UUFDeEQsTUFBTSxDQUFDLElBQUksdURBQTBCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVNLDZDQUFTLEdBQWhCO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVNLDhDQUFVLEdBQWpCO1FBQ0ksSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUMvQixDQUFDO0lBRUQsc0JBQWtCLG9DQUFPO2FBQXpCLGNBQThCLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUM3QyxnQ0FBQztBQUFELENBQUMsQUFqRUQsSUFpRUM7QUFqRVksaUNBQXlCLDRCQWlFckMsQ0FBQTtBQUVELElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogIEBsaWNlbnNlICAgTUlUXHJcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IFJlcGxheVN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgQ2xvc2VBY3Rpb24sIEVycm9yQWN0aW9uLCBJTGFuZ3VhZ2VQcm90b2NvbFNlcnZlck9wdGlvbnMsIElMYW5ndWFnZVByb3ZpZGVyLCBJTGFuZ3VhZ2VTZXJ2aWNlLCBUcmFuc3BvcnRLaW5kIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzJztcclxuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAndHMtZGlzcG9zYWJsZXMnO1xyXG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAndnNjb2RlLWpzb25ycGMnO1xyXG5pbXBvcnQgeyBBdG9tTGFuZ3VhZ2VDc2hhcnBTZXR0aW5ncywgSUF0b21MYW5ndWFnZUNzaGFycFNldHRpbmdzIH0gZnJvbSAnLi9hdG9tL0F0b21MYW5ndWFnZUNzaGFycFNldHRpbmdzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBBdG9tTGFuZ3VhZ2VDc2hhcnBQYWNrYWdlIGltcGxlbWVudHMgSUF0b21QYWNrYWdlPElBdG9tTGFuZ3VhZ2VDc2hhcnBTZXR0aW5ncz4ge1xyXG4gICAgcHJpdmF0ZSBfZGlzcG9zYWJsZTogQ29tcG9zaXRlRGlzcG9zYWJsZTtcclxuICAgIHByaXZhdGUgX3NldHRpbmdzOiBBdG9tTGFuZ3VhZ2VDc2hhcnBTZXR0aW5ncztcclxuICAgIHByaXZhdGUgX3N0YXRlQ2hhbmdlOiBSZXBsYXlTdWJqZWN0PGJvb2xlYW4+O1xyXG4gICAgcHJpdmF0ZSBfbGFuZ3VhZ2VTZXJ2aWNlOiBJTGFuZ3VhZ2VTZXJ2aWNlO1xyXG5cclxuICAgIC8qIHRzbGludDpkaXNhYmxlOm5vLWFueSAqL1xyXG4gICAgcHVibGljIGFjdGl2YXRlKHNldHRpbmdzOiBJQXRvbUxhbmd1YWdlQ3NoYXJwU2V0dGluZ3MpIHtcclxuICAgICAgICB0aGlzLl9kaXNwb3NhYmxlID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcclxuICAgICAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzIGluc3RhbmNlb2YgQXRvbUxhbmd1YWdlQ3NoYXJwU2V0dGluZ3MgPyBzZXR0aW5ncyA6IG5ldyBBdG9tTGFuZ3VhZ2VDc2hhcnBTZXR0aW5ncyhzZXR0aW5ncyk7XHJcbiAgICAgICAgdGhpcy5fc3RhdGVDaGFuZ2UgPSBuZXcgUmVwbGF5U3ViamVjdDxib29sZWFuPigxKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6ZnVuY3Rpb24tbmFtZSAqL1xyXG4gICAgcHVibGljIFsnY29uc3VtZS1hdG9tLWxhbmd1YWdlLWNsaWVudCddKHNlcnZpY2U6IElMYW5ndWFnZVNlcnZpY2UpIHtcclxuICAgICAgICB0aGlzLl9sYW5ndWFnZVNlcnZpY2UgPSBzZXJ2aWNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpmdW5jdGlvbi1uYW1lICovXHJcbiAgICBwdWJsaWMgWydwcm92aWRlLWF0b20tbGFuZ3VhZ2UnXSgpOiBJTGFuZ3VhZ2VQcm92aWRlciB7XHJcbiAgICAgICAgY29uc3Qgc2VydmVyTW9kdWxlID0gam9pbihfX2Rpcm5hbWUsICdub2RlX21vZHVsZXMvb21uaXNoYXJwLWNsaWVudC9sYW5ndWFnZXNlcnZlci9zZXJ2ZXIuanMnKTtcclxuICAgICAgICBjb25zdCBzZXJ2ZXJPcHRpb25zOiBJTGFuZ3VhZ2VQcm90b2NvbFNlcnZlck9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHJ1bjogeyBtb2R1bGU6IHNlcnZlck1vZHVsZSwgdHJhbnNwb3J0OiBUcmFuc3BvcnRLaW5kLnN0ZGlvIH0sXHJcbiAgICAgICAgICAgIGRlYnVnOiB7IG1vZHVsZTogc2VydmVyTW9kdWxlLCB0cmFuc3BvcnQ6IFRyYW5zcG9ydEtpbmQuc3RkaW8gfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiA8SUxhbmd1YWdlUHJvdmlkZXI+e1xyXG4gICAgICAgICAgICBjbGllbnRPcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICBkaWFnbm9zdGljQ29sbGVjdGlvbk5hbWU6ICdjIycsXHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudFNlbGVjdG9yOiAnYyMnLFxyXG4gICAgICAgICAgICAgICAgZXJyb3JIYW5kbGVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IChlcnJvcjogRXJyb3IsIG1lc3NhZ2U6IE1lc3NhZ2UsIGNvdW50OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvciwgbWVzc2FnZSwgY291bnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gRXJyb3JBY3Rpb24uQ29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBjbG9zZWQoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Nsb3NlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gQ2xvc2VBY3Rpb24uUmVzdGFydDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgb3V0cHV0Q2hhbm5lbE5hbWU6ICdjIycsXHJcbiAgICAgICAgICAgICAgICBpbml0aWFsaXphdGlvbk9wdGlvbnM6IHt9LFxyXG4gICAgICAgICAgICAgICAgc3luY2hyb25pemU6IHtcclxuICAgICAgICAgICAgICAgICAgICBleHRlbnNpb25TZWxlY3RvcjogWycuY3MnXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXJ2ZXJPcHRpb25zLFxyXG4gICAgICAgICAgICBkaXNwb3NlKCkgeyAvKiAqLyB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55ICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGRlc2VyaWFsaXplKHN0YXRlOiBJQXRvbUxhbmd1YWdlQ3NoYXJwU2V0dGluZ3MpIHtcclxuICAgICAgICByZXR1cm4gbmV3IEF0b21MYW5ndWFnZUNzaGFycFNldHRpbmdzKHN0YXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VyaWFsaXplKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zZXR0aW5ncy5zZXJpYWxpemUoQXRvbUxhbmd1YWdlQ3NoYXJwUGFja2FnZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5kaXNwb3NlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgdmVyc2lvbigpIHsgcmV0dXJuIDE7IH1cclxufVxyXG5cclxuYXRvbS5kZXNlcmlhbGl6ZXJzLmFkZChBdG9tTGFuZ3VhZ2VDc2hhcnBQYWNrYWdlKTtcclxuIl19