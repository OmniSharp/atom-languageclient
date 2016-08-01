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
        decorators_1.capability,
        __param(0, decorators_1.inject(atom_languageservices_1.ILanguageProtocolClient)),
        __param(1, decorators_1.inject(atom_languageservices_1.ILinterService)), 
        __metadata('design:paramtypes', [Object, Object])
    ], LinterProtocol);
    return LinterProtocol;
}(ts_disposables_1.DisposableBase));
exports.LinterProtocol = LinterProtocol;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGludGVyUHJvdG9jb2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2FwYWJpbGl0aWVzL0xpbnRlclByb3RvY29sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCxJQUFZLENBQUMsV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUM1QixzQ0FBZ0UsdUJBQXVCLENBQUMsQ0FBQTtBQUN4RiwyQkFBbUMsa0NBQWtDLENBQUMsQ0FBQTtBQUN0RSx5QkFBK0MsZ0NBQWdDLENBQUMsQ0FBQTtBQUVoRiwrQkFBK0IsZ0JBQWdCLENBQUMsQ0FBQTtBQUNoRCx3QkFBbUMsaUJBQWlCLENBQUMsQ0FBQTtBQUdyRDtJQUFvQyxrQ0FBYztJQU05Qyx3QkFDcUMsTUFBK0IsRUFDeEMsYUFBNkI7UUFSN0QsaUJBb0VDO1FBM0RPLGlCQUFPLENBQUM7UUFMSixpQkFBWSxHQUFHLElBQUksR0FBRyxFQUE0QixDQUFDO1FBbUJwRCxtQkFBYyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQzlCO1lBQ0ksS0FBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0UsQ0FBQyxFQUNELEdBQUcsRUFDSCxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFsQm5DLElBQUksQ0FBQyxjQUFjLEdBQUcsYUFBYSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUV0QixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVNLG9DQUFXLEdBQWxCLFVBQW1CLElBQVksRUFBRSxRQUEwQjtRQUN2RCxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFTTyxtQ0FBVSxHQUFsQjtRQUNJLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLHlDQUE4QixDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzdHLENBQUM7SUFFTyw0Q0FBbUIsR0FBM0IsVUFBNEIsRUFBNEM7WUFBM0MsWUFBRyxFQUFFLDRCQUFXO1FBQ3pDLEdBQUcsR0FBRyxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQztRQUMxQixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVPLHlDQUFnQixHQUF4QixVQUF5QixJQUFZLEVBQUUsV0FBeUI7UUFDNUQsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBRU8sd0NBQWUsR0FBdkIsVUFBd0IsSUFBWSxFQUFFLFVBQXNCO1FBQ3hELE1BQU0sQ0FBQztZQUNILFFBQVEsRUFBRSxJQUFJO1lBQ2QsSUFBSSxFQUFFLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO1lBQ3ZELElBQUksRUFBRSxVQUFVLENBQUMsT0FBTztZQUN4QixLQUFLLEVBQUUsbUJBQVMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO1lBQ2xDLFFBQVEsRUFBRSxJQUFJLENBQUMsdUJBQXVCLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQztZQUMzRCxJQUFJLEVBQUUsVUFBVSxDQUFDLElBQUk7WUFDckIsSUFBSSxFQUFFLFVBQVUsQ0FBQyxNQUFNO1NBQzFCLENBQUM7SUFDTixDQUFDO0lBRU8sZ0RBQXVCLEdBQS9CLFVBQWdDLEtBQXlCO1FBQ3JELE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDWixLQUFLLGFBQXdCO2dCQUN6QixNQUFNLENBQUMsT0FBTyxDQUFDO1lBQ25CLEtBQUssZUFBMEI7Z0JBQzNCLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDckIsS0FBSyxtQkFBOEIsQ0FBQztZQUNwQyxLQUFLLFlBQXVCO2dCQUN4QixNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ2xCO2dCQUNJLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDdkIsQ0FBQztJQUNMLENBQUM7SUFwRUw7UUFBQyx1QkFBVTttQkFRRixtQkFBTSxDQUFDLCtDQUF1QixDQUFDO21CQUMvQixtQkFBTSxDQUFDLHNDQUFjLENBQUM7O3NCQVRwQjtJQXFFWCxxQkFBQztBQUFELENBQUMsQUFwRUQsQ0FBb0MsK0JBQWMsR0FvRWpEO0FBcEVZLHNCQUFjLGlCQW9FMUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiAgQGxpY2Vuc2UgICBNSVRcclxuICogIEBjb3B5cmlnaHQgT21uaVNoYXJwIFRlYW1cclxuICogIEBzdW1tYXJ5ICAgQWRkcyBzdXBwb3J0IGZvciBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L2xhbmd1YWdlLXNlcnZlci1wcm90b2NvbCAoYW5kIG1vcmUhKSB0byBodHRwczovL2F0b20uaW9cclxuICovXHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQsIElMaW50ZXJTZXJ2aWNlLCBMaW50ZXIgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMnO1xyXG5pbXBvcnQgeyBjYXBhYmlsaXR5LCBpbmplY3QgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvZGVjb3JhdG9ycyc7XHJcbmltcG9ydCB7IFB1Ymxpc2hEaWFnbm9zdGljc05vdGlmaWNhdGlvbiB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9wcm90b2NvbCc7XHJcbmltcG9ydCB7IERpYWdub3N0aWMsIERpYWdub3N0aWNTZXZlcml0eSwgUHVibGlzaERpYWdub3N0aWNzUGFyYW1zIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL3R5cGVzJztcclxuaW1wb3J0IHsgRGlzcG9zYWJsZUJhc2UgfSBmcm9tICd0cy1kaXNwb3NhYmxlcyc7XHJcbmltcG9ydCB7IGZyb21SYW5nZSwgZnJvbVVyaSB9IGZyb20gJy4vdXRpbHMvY29udmVydCc7XHJcblxyXG5AY2FwYWJpbGl0eVxyXG5leHBvcnQgY2xhc3MgTGludGVyUHJvdG9jb2wgZXh0ZW5kcyBEaXNwb3NhYmxlQmFzZSB7XHJcbiAgICBwcml2YXRlIF9jbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50O1xyXG4gICAgcHJpdmF0ZSBfbGludGVyU2VydmljZTogSUxpbnRlclNlcnZpY2U7XHJcbiAgICBwcml2YXRlIF9saW50ZXI6IExpbnRlci5JbmRpZUxpbnRlcjtcclxuICAgIHByaXZhdGUgX2RpYWdub3N0aWNzID0gbmV3IE1hcDxzdHJpbmcsIExpbnRlci5NZXNzYWdlW10+KCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgQGluamVjdChJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCkgY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCxcclxuICAgICAgICBAaW5qZWN0KElMaW50ZXJTZXJ2aWNlKSBsaW50ZXJTZXJ2aWNlOiBJTGludGVyU2VydmljZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fbGludGVyU2VydmljZSA9IGxpbnRlclNlcnZpY2U7XHJcbiAgICAgICAgdGhpcy5fbGludGVyID0gdGhpcy5fbGludGVyU2VydmljZS5nZXRMaW50ZXIoY2xpZW50Lm5hbWUpO1xyXG4gICAgICAgIHRoaXMuX2Rpc3Bvc2FibGUuYWRkKHRoaXMuX2xpbnRlcik7XHJcbiAgICAgICAgdGhpcy5fY2xpZW50ID0gY2xpZW50O1xyXG5cclxuICAgICAgICB0aGlzLl9jb25maWd1cmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0TWVzc2FnZXMocGF0aDogc3RyaW5nLCBtZXNzYWdlczogTGludGVyLk1lc3NhZ2VbXSkge1xyXG4gICAgICAgIHRoaXMuX2RpYWdub3N0aWNzLnNldChwYXRoLCBtZXNzYWdlcyk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVNZXNzYWdlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGVNZXNzYWdlcyA9IF8udGhyb3R0bGUoXHJcbiAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9saW50ZXIuc2V0TWVzc2FnZXMoXy5mbGF0dGVuKF8udG9BcnJheSh0aGlzLl9kaWFnbm9zdGljcy52YWx1ZXMoKSkpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIDEwMCxcclxuICAgICAgICB7IHRyYWlsaW5nOiB0cnVlLCBsZWFkaW5nOiB0cnVlIH0pO1xyXG5cclxuICAgIHByaXZhdGUgX2NvbmZpZ3VyZSgpIHtcclxuICAgICAgICB0aGlzLl9jbGllbnQub25Ob3RpZmljYXRpb24oUHVibGlzaERpYWdub3N0aWNzTm90aWZpY2F0aW9uLnR5cGUsIF8uYmluZCh0aGlzLl9yZWNpZXZlRGlhZ25vc3RpY3MsIHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yZWNpZXZlRGlhZ25vc3RpY3Moe3VyaSwgZGlhZ25vc3RpY3N9OiBQdWJsaXNoRGlhZ25vc3RpY3NQYXJhbXMpIHtcclxuICAgICAgICB1cmkgPSBmcm9tVXJpKHVyaSkgfHwgdXJpO1xyXG4gICAgICAgIHRoaXMuc2V0TWVzc2FnZXModXJpLCB0aGlzLl9mcm9tRGlhZ25vc3RpY3ModXJpLCBkaWFnbm9zdGljcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2Zyb21EaWFnbm9zdGljcyhwYXRoOiBzdHJpbmcsIGRpYWdub3N0aWNzOiBEaWFnbm9zdGljW10pOiBMaW50ZXIuTWVzc2FnZVtdIHtcclxuICAgICAgICByZXR1cm4gXy5tYXAoZGlhZ25vc3RpY3MsIF8uYmluZCh0aGlzLl9mcm9tRGlhZ25vc3RpYywgdGhpcywgcGF0aCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2Zyb21EaWFnbm9zdGljKHBhdGg6IHN0cmluZywgZGlhZ25vc3RpYzogRGlhZ25vc3RpYyk6IExpbnRlci5UZXh0TWVzc2FnZSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZmlsZVBhdGg6IHBhdGgsXHJcbiAgICAgICAgICAgIHR5cGU6IHRoaXMuX2Zyb21EaWFnbm9zdGljU2V2ZXJpdHkoZGlhZ25vc3RpYy5zZXZlcml0eSksXHJcbiAgICAgICAgICAgIHRleHQ6IGRpYWdub3N0aWMubWVzc2FnZSxcclxuICAgICAgICAgICAgcmFuZ2U6IGZyb21SYW5nZShkaWFnbm9zdGljLnJhbmdlKSxcclxuICAgICAgICAgICAgc2V2ZXJpdHk6IHRoaXMuX2Zyb21EaWFnbm9zdGljU2V2ZXJpdHkoZGlhZ25vc3RpYy5zZXZlcml0eSksXHJcbiAgICAgICAgICAgIGNvZGU6IGRpYWdub3N0aWMuY29kZSxcclxuICAgICAgICAgICAgbmFtZTogZGlhZ25vc3RpYy5zb3VyY2VcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2Zyb21EaWFnbm9zdGljU2V2ZXJpdHkodmFsdWU6IG51bWJlciB8IHVuZGVmaW5lZCk6ICgnZXJyb3InIHwgJ3dhcm5pbmcnIHwgJ2luZm8nKSB7XHJcbiAgICAgICAgc3dpdGNoICh2YWx1ZSkge1xyXG4gICAgICAgICAgICBjYXNlIERpYWdub3N0aWNTZXZlcml0eS5FcnJvcjpcclxuICAgICAgICAgICAgICAgIHJldHVybiAnZXJyb3InO1xyXG4gICAgICAgICAgICBjYXNlIERpYWdub3N0aWNTZXZlcml0eS5XYXJuaW5nOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICd3YXJuaW5nJztcclxuICAgICAgICAgICAgY2FzZSBEaWFnbm9zdGljU2V2ZXJpdHkuSW5mb3JtYXRpb246XHJcbiAgICAgICAgICAgIGNhc2UgRGlhZ25vc3RpY1NldmVyaXR5LkhpbnQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2luZm8nO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICdlcnJvcic7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==