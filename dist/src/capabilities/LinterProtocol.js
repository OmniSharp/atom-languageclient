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
var _ = require('lodash');
var atom_languageservices_1 = require('atom-languageservices');
var decorators_1 = require('atom-languageservices/decorators');
var protocol_1 = require('atom-languageservices/protocol');
var ts_disposables_1 = require('ts-disposables');
var convert_1 = require('./utils/convert');
var LinterProtocol = (function (_super) {
    __extends(LinterProtocol, _super);
    function LinterProtocol(client, linterService) {
        var _this = this;
        _super.call(this);
        this._diagnostics = new Map();
        this.updateMessages = _.throttle(function () {
            _this._linter.setMessages(_.flatten(_.toArray(_this._diagnostics.values())));
        }, 100, { trailing: true, leading: true });
        this._linterService = linterService;
        this._linter = this._linterService.getLinter(client.name);
        this._disposable.add(this._linter);
        this._client = client;
        this._configure();
    }
    LinterProtocol.prototype.setMessages = function (path, messages) {
        this._diagnostics.set(path, messages);
        this.updateMessages();
    };
    LinterProtocol.prototype._configure = function () {
        this._client.onNotification(protocol_1.PublishDiagnosticsNotification.type, _.bind(this._recieveDiagnostics, this));
    };
    LinterProtocol.prototype._recieveDiagnostics = function (_a) {
        var uri = _a.uri, diagnostics = _a.diagnostics;
        uri = convert_1.fromUri(uri) || uri;
        this.setMessages(uri, this._fromDiagnostics(uri, diagnostics));
    };
    LinterProtocol.prototype._fromDiagnostics = function (path, diagnostics) {
        return _.map(diagnostics, _.bind(this._fromDiagnostic, this, path));
    };
    LinterProtocol.prototype._fromDiagnostic = function (path, diagnostic) {
        return {
            filePath: path,
            type: this._fromDiagnosticSeverity(diagnostic.severity),
            text: diagnostic.message,
            range: convert_1.fromRange(diagnostic.range),
            severity: this._fromDiagnosticSeverity(diagnostic.severity),
            code: diagnostic.code,
            name: diagnostic.source
        };
    };
    LinterProtocol.prototype._fromDiagnosticSeverity = function (value) {
        switch (value) {
            case 1 /* Error */:
                return 'error';
            case 2 /* Warning */:
                return 'warning';
            case 3 /* Information */:
            case 4 /* Hint */:
                return 'info';
            default:
                return 'error';
        }
    };
    LinterProtocol = __decorate([
        decorators_1.capability(),
        __param(0, decorators_1.inject(atom_languageservices_1.ILanguageProtocolClient)),
        __param(1, decorators_1.inject(atom_languageservices_1.ILinterService)), 
        __metadata('design:paramtypes', [Object, Object])
    ], LinterProtocol);
    return LinterProtocol;
}(ts_disposables_1.DisposableBase));
exports.LinterProtocol = LinterProtocol;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGludGVyUHJvdG9jb2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2FwYWJpbGl0aWVzL0xpbnRlclByb3RvY29sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCxJQUFZLENBQUMsV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUM1QixzQ0FBZ0UsdUJBQXVCLENBQUMsQ0FBQTtBQUN4RiwyQkFBbUMsa0NBQWtDLENBQUMsQ0FBQTtBQUN0RSx5QkFBK0MsZ0NBQWdDLENBQUMsQ0FBQTtBQUVoRiwrQkFBK0IsZ0JBQWdCLENBQUMsQ0FBQTtBQUNoRCx3QkFBbUMsaUJBQWlCLENBQUMsQ0FBQTtBQUdyRDtJQUFvQyxrQ0FBYztJQU05Qyx3QkFDcUMsTUFBK0IsRUFDeEMsYUFBNkI7UUFSN0QsaUJBb0VDO1FBM0RPLGlCQUFPLENBQUM7UUFMSixpQkFBWSxHQUFHLElBQUksR0FBRyxFQUE0QixDQUFDO1FBbUJwRCxtQkFBYyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQzlCO1lBQ0ksS0FBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0UsQ0FBQyxFQUNELEdBQUcsRUFDSCxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFsQm5DLElBQUksQ0FBQyxjQUFjLEdBQUcsYUFBYSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUV0QixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVNLG9DQUFXLEdBQWxCLFVBQW1CLElBQVksRUFBRSxRQUEwQjtRQUN2RCxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFTTyxtQ0FBVSxHQUFsQjtRQUNJLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLHlDQUE4QixDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzdHLENBQUM7SUFFTyw0Q0FBbUIsR0FBM0IsVUFBNEIsRUFBNEM7WUFBM0MsWUFBRyxFQUFFLDRCQUFXO1FBQ3pDLEdBQUcsR0FBRyxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQztRQUMxQixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVPLHlDQUFnQixHQUF4QixVQUF5QixJQUFZLEVBQUUsV0FBeUI7UUFDNUQsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBRU8sd0NBQWUsR0FBdkIsVUFBd0IsSUFBWSxFQUFFLFVBQXNCO1FBQ3hELE1BQU0sQ0FBQztZQUNILFFBQVEsRUFBRSxJQUFJO1lBQ2QsSUFBSSxFQUFFLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO1lBQ3ZELElBQUksRUFBRSxVQUFVLENBQUMsT0FBTztZQUN4QixLQUFLLEVBQUUsbUJBQVMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO1lBQ2xDLFFBQVEsRUFBRSxJQUFJLENBQUMsdUJBQXVCLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQztZQUMzRCxJQUFJLEVBQUUsVUFBVSxDQUFDLElBQUk7WUFDckIsSUFBSSxFQUFFLFVBQVUsQ0FBQyxNQUFNO1NBQzFCLENBQUM7SUFDTixDQUFDO0lBRU8sZ0RBQXVCLEdBQS9CLFVBQWdDLEtBQXlCO1FBQ3JELE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDWixLQUFLLGFBQXdCO2dCQUN6QixNQUFNLENBQUMsT0FBTyxDQUFDO1lBQ25CLEtBQUssZUFBMEI7Z0JBQzNCLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDckIsS0FBSyxtQkFBOEIsQ0FBQztZQUNwQyxLQUFLLFlBQXVCO2dCQUN4QixNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ2xCO2dCQUNJLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDdkIsQ0FBQztJQUNMLENBQUM7SUFwRUw7UUFBQyx1QkFBVSxFQUFFO21CQVFKLG1CQUFNLENBQUMsK0NBQXVCLENBQUM7bUJBQy9CLG1CQUFNLENBQUMsc0NBQWMsQ0FBQzs7c0JBVGxCO0lBcUViLHFCQUFDO0FBQUQsQ0FBQyxBQXBFRCxDQUFvQywrQkFBYyxHQW9FakQ7QUFwRVksc0JBQWMsaUJBb0UxQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCwgSUxpbnRlclNlcnZpY2UsIExpbnRlciB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCB7IGNhcGFiaWxpdHksIGluamVjdCB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9kZWNvcmF0b3JzJztcclxuaW1wb3J0IHsgUHVibGlzaERpYWdub3N0aWNzTm90aWZpY2F0aW9uIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL3Byb3RvY29sJztcclxuaW1wb3J0IHsgRGlhZ25vc3RpYywgRGlhZ25vc3RpY1NldmVyaXR5LCBQdWJsaXNoRGlhZ25vc3RpY3NQYXJhbXMgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvdHlwZXMnO1xyXG5pbXBvcnQgeyBEaXNwb3NhYmxlQmFzZSB9IGZyb20gJ3RzLWRpc3Bvc2FibGVzJztcclxuaW1wb3J0IHsgZnJvbVJhbmdlLCBmcm9tVXJpIH0gZnJvbSAnLi91dGlscy9jb252ZXJ0JztcclxuXHJcbkBjYXBhYmlsaXR5KClcclxuZXhwb3J0IGNsYXNzIExpbnRlclByb3RvY29sIGV4dGVuZHMgRGlzcG9zYWJsZUJhc2Uge1xyXG4gICAgcHJpdmF0ZSBfY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudDtcclxuICAgIHByaXZhdGUgX2xpbnRlclNlcnZpY2U6IElMaW50ZXJTZXJ2aWNlO1xyXG4gICAgcHJpdmF0ZSBfbGludGVyOiBMaW50ZXIuSW5kaWVMaW50ZXI7XHJcbiAgICBwcml2YXRlIF9kaWFnbm9zdGljcyA9IG5ldyBNYXA8c3RyaW5nLCBMaW50ZXIuTWVzc2FnZVtdPigpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIEBpbmplY3QoSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQpIGNsaWVudDogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQsXHJcbiAgICAgICAgQGluamVjdChJTGludGVyU2VydmljZSkgbGludGVyU2VydmljZTogSUxpbnRlclNlcnZpY2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2xpbnRlclNlcnZpY2UgPSBsaW50ZXJTZXJ2aWNlO1xyXG4gICAgICAgIHRoaXMuX2xpbnRlciA9IHRoaXMuX2xpbnRlclNlcnZpY2UuZ2V0TGludGVyKGNsaWVudC5uYW1lKTtcclxuICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLmFkZCh0aGlzLl9saW50ZXIpO1xyXG4gICAgICAgIHRoaXMuX2NsaWVudCA9IGNsaWVudDtcclxuXHJcbiAgICAgICAgdGhpcy5fY29uZmlndXJlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldE1lc3NhZ2VzKHBhdGg6IHN0cmluZywgbWVzc2FnZXM6IExpbnRlci5NZXNzYWdlW10pIHtcclxuICAgICAgICB0aGlzLl9kaWFnbm9zdGljcy5zZXQocGF0aCwgbWVzc2FnZXMpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlTWVzc2FnZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlTWVzc2FnZXMgPSBfLnRocm90dGxlKFxyXG4gICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fbGludGVyLnNldE1lc3NhZ2VzKF8uZmxhdHRlbihfLnRvQXJyYXkodGhpcy5fZGlhZ25vc3RpY3MudmFsdWVzKCkpKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAxMDAsXHJcbiAgICAgICAgeyB0cmFpbGluZzogdHJ1ZSwgbGVhZGluZzogdHJ1ZSB9KTtcclxuXHJcbiAgICBwcml2YXRlIF9jb25maWd1cmUoKSB7XHJcbiAgICAgICAgdGhpcy5fY2xpZW50Lm9uTm90aWZpY2F0aW9uKFB1Ymxpc2hEaWFnbm9zdGljc05vdGlmaWNhdGlvbi50eXBlLCBfLmJpbmQodGhpcy5fcmVjaWV2ZURpYWdub3N0aWNzLCB0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcmVjaWV2ZURpYWdub3N0aWNzKHt1cmksIGRpYWdub3N0aWNzfTogUHVibGlzaERpYWdub3N0aWNzUGFyYW1zKSB7XHJcbiAgICAgICAgdXJpID0gZnJvbVVyaSh1cmkpIHx8IHVyaTtcclxuICAgICAgICB0aGlzLnNldE1lc3NhZ2VzKHVyaSwgdGhpcy5fZnJvbURpYWdub3N0aWNzKHVyaSwgZGlhZ25vc3RpY3MpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9mcm9tRGlhZ25vc3RpY3MocGF0aDogc3RyaW5nLCBkaWFnbm9zdGljczogRGlhZ25vc3RpY1tdKTogTGludGVyLk1lc3NhZ2VbXSB7XHJcbiAgICAgICAgcmV0dXJuIF8ubWFwKGRpYWdub3N0aWNzLCBfLmJpbmQodGhpcy5fZnJvbURpYWdub3N0aWMsIHRoaXMsIHBhdGgpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9mcm9tRGlhZ25vc3RpYyhwYXRoOiBzdHJpbmcsIGRpYWdub3N0aWM6IERpYWdub3N0aWMpOiBMaW50ZXIuVGV4dE1lc3NhZ2Uge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGZpbGVQYXRoOiBwYXRoLFxyXG4gICAgICAgICAgICB0eXBlOiB0aGlzLl9mcm9tRGlhZ25vc3RpY1NldmVyaXR5KGRpYWdub3N0aWMuc2V2ZXJpdHkpLFxyXG4gICAgICAgICAgICB0ZXh0OiBkaWFnbm9zdGljLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgIHJhbmdlOiBmcm9tUmFuZ2UoZGlhZ25vc3RpYy5yYW5nZSksXHJcbiAgICAgICAgICAgIHNldmVyaXR5OiB0aGlzLl9mcm9tRGlhZ25vc3RpY1NldmVyaXR5KGRpYWdub3N0aWMuc2V2ZXJpdHkpLFxyXG4gICAgICAgICAgICBjb2RlOiBkaWFnbm9zdGljLmNvZGUsXHJcbiAgICAgICAgICAgIG5hbWU6IGRpYWdub3N0aWMuc291cmNlXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9mcm9tRGlhZ25vc3RpY1NldmVyaXR5KHZhbHVlOiBudW1iZXIgfCB1bmRlZmluZWQpOiAoJ2Vycm9yJyB8ICd3YXJuaW5nJyB8ICdpbmZvJykge1xyXG4gICAgICAgIHN3aXRjaCAodmFsdWUpIHtcclxuICAgICAgICAgICAgY2FzZSBEaWFnbm9zdGljU2V2ZXJpdHkuRXJyb3I6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2Vycm9yJztcclxuICAgICAgICAgICAgY2FzZSBEaWFnbm9zdGljU2V2ZXJpdHkuV2FybmluZzpcclxuICAgICAgICAgICAgICAgIHJldHVybiAnd2FybmluZyc7XHJcbiAgICAgICAgICAgIGNhc2UgRGlhZ25vc3RpY1NldmVyaXR5LkluZm9ybWF0aW9uOlxyXG4gICAgICAgICAgICBjYXNlIERpYWdub3N0aWNTZXZlcml0eS5IaW50OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICdpbmZvJztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHJldHVybiAnZXJyb3InO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=