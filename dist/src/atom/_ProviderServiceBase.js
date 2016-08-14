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
var ts_disposables_1 = require('ts-disposables');
var ProviderServiceBase = (function (_super) {
    __extends(ProviderServiceBase, _super);
    function ProviderServiceBase() {
        var _this = this;
        _super.call(this);
        this._providers = new Set();
        this._computeInvoke();
        this._disposable.add(ts_disposables_1.Disposable.create(function () {
            _this._providers.forEach(function (x) { return x.dispose(); });
            _this._providers.clear();
        }));
    }
    ProviderServiceBase.prototype.invoke = function (options) {
        return this._invoke(options);
    };
    Object.defineProperty(ProviderServiceBase.prototype, "hasProviders", {
        get: function () { return !!this._providers.size; },
        enumerable: true,
        configurable: true
    });
    ProviderServiceBase.prototype._computeInvoke = function () {
        var callbacks = _.map(_.toArray(this._providers), function (provider) {
            return function (options) { return provider.request(options); };
        });
        this._invoke = this.createInvoke(callbacks);
    };
    ProviderServiceBase.prototype.registerProvider = function (provider) {
        var _this = this;
        this._providers.add(provider);
        this._computeInvoke();
        return ts_disposables_1.Disposable.create(function () {
            _this._providers.delete(provider);
            _this._computeInvoke();
        });
    };
    return ProviderServiceBase;
}(ts_disposables_1.DisposableBase));
exports.ProviderServiceBase = ProviderServiceBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX1Byb3ZpZGVyU2VydmljZUJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXRvbS9fUHJvdmlkZXJTZXJ2aWNlQmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztHQUlHO0FBQ0gsSUFBWSxDQUFDLFdBQU0sUUFBUSxDQUFDLENBQUE7QUFDNUIsK0JBQXdELGdCQUFnQixDQUFDLENBQUE7QUFFekU7SUFBMkssdUNBQWM7SUFJckw7UUFKSixpQkF1Q0M7UUFsQ08saUJBQU8sQ0FBQztRQUpKLGVBQVUsR0FBbUIsSUFBSSxHQUFHLEVBQWEsQ0FBQztRQUt0RCxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQ2hCLDJCQUFVLENBQUMsTUFBTSxDQUFDO1lBQ2QsS0FBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQVgsQ0FBVyxDQUFDLENBQUM7WUFDMUMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FDTCxDQUFDO0lBQ04sQ0FBQztJQUlTLG9DQUFNLEdBQWhCLFVBQWlCLE9BQWlCO1FBQzlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxzQkFBYyw2Q0FBWTthQUExQixjQUErQixNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFdkQsNENBQWMsR0FBdEI7UUFDSSxJQUFNLFNBQVMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLFVBQUEsUUFBUTtZQUN4RCxNQUFNLENBQUMsVUFBQyxPQUFpQixJQUFLLE9BQUEsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBekIsQ0FBeUIsQ0FBQztRQUM1RCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRU0sOENBQWdCLEdBQXZCLFVBQXdCLFFBQW1CO1FBQTNDLGlCQVFDO1FBUEcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRXRCLE1BQU0sQ0FBQywyQkFBVSxDQUFDLE1BQU0sQ0FBQztZQUNyQixLQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNqQyxLQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDMUIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0wsMEJBQUM7QUFBRCxDQUFDLEFBdkNELENBQTJLLCtCQUFjLEdBdUN4TDtBQXZDcUIsMkJBQW1CLHNCQXVDeEMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiAgQGxpY2Vuc2UgICBNSVRcclxuICogIEBjb3B5cmlnaHQgT21uaVNoYXJwIFRlYW1cclxuICogIEBzdW1tYXJ5ICAgQWRkcyBzdXBwb3J0IGZvciBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L2xhbmd1YWdlLXNlcnZlci1wcm90b2NvbCAoYW5kIG1vcmUhKSB0byBodHRwczovL2F0b20uaW9cclxuICovXHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgRGlzcG9zYWJsZSwgRGlzcG9zYWJsZUJhc2UsIElEaXNwb3NhYmxlIH0gZnJvbSAndHMtZGlzcG9zYWJsZXMnO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFByb3ZpZGVyU2VydmljZUJhc2U8VFByb3ZpZGVyIGV4dGVuZHMgeyByZXF1ZXN0OiAob3B0aW9uczogVFJlcXVlc3QpID0+IFRSZXNwb25zZTsgfSAmIElEaXNwb3NhYmxlLCBUUmVxdWVzdCwgVFJlc3BvbnNlLCBUQWdncmVnYXRlUmVzcG9uc2U+IGV4dGVuZHMgRGlzcG9zYWJsZUJhc2Uge1xyXG4gICAgcHJpdmF0ZSBfcHJvdmlkZXJzOiBTZXQ8VFByb3ZpZGVyPiA9IG5ldyBTZXQ8VFByb3ZpZGVyPigpO1xyXG4gICAgcHJpdmF0ZSBfaW52b2tlOiAob3B0aW9uczogVFJlcXVlc3QpID0+IFRBZ2dyZWdhdGVSZXNwb25zZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2NvbXB1dGVJbnZva2UoKTtcclxuICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLmFkZChcclxuICAgICAgICAgICAgRGlzcG9zYWJsZS5jcmVhdGUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvdmlkZXJzLmZvckVhY2goeCA9PiB4LmRpc3Bvc2UoKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm92aWRlcnMuY2xlYXIoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBhYnN0cmFjdCBjcmVhdGVJbnZva2UoY2FsbGJhY2tzOiAoKG9wdGlvbnM6IFRSZXF1ZXN0KSA9PiBUUmVzcG9uc2UpW10pOiAob3B0aW9uczogVFJlcXVlc3QpID0+IFRBZ2dyZWdhdGVSZXNwb25zZTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgaW52b2tlKG9wdGlvbnM6IFRSZXF1ZXN0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShvcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0IGhhc1Byb3ZpZGVycygpIHsgcmV0dXJuICEhdGhpcy5fcHJvdmlkZXJzLnNpemU7IH1cclxuXHJcbiAgICBwcml2YXRlIF9jb21wdXRlSW52b2tlKCkge1xyXG4gICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9IF8ubWFwKF8udG9BcnJheSh0aGlzLl9wcm92aWRlcnMpLCBwcm92aWRlciA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAob3B0aW9uczogVFJlcXVlc3QpID0+IHByb3ZpZGVyLnJlcXVlc3Qob3B0aW9ucyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5faW52b2tlID0gdGhpcy5jcmVhdGVJbnZva2UoY2FsbGJhY2tzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJQcm92aWRlcihwcm92aWRlcjogVFByb3ZpZGVyKSB7XHJcbiAgICAgICAgdGhpcy5fcHJvdmlkZXJzLmFkZChwcm92aWRlcik7XHJcbiAgICAgICAgdGhpcy5fY29tcHV0ZUludm9rZSgpO1xyXG5cclxuICAgICAgICByZXR1cm4gRGlzcG9zYWJsZS5jcmVhdGUoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9wcm92aWRlcnMuZGVsZXRlKHByb3ZpZGVyKTtcclxuICAgICAgICAgICAgdGhpcy5fY29tcHV0ZUludm9rZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==