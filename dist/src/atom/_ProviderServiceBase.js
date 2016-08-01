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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX1Byb3ZpZGVyU2VydmljZUJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXRvbS9fUHJvdmlkZXJTZXJ2aWNlQmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztHQUlHO0FBQ0gsSUFBWSxDQUFDLFdBQU0sUUFBUSxDQUFDLENBQUE7QUFDNUIsK0JBQXdELGdCQUFnQixDQUFDLENBQUE7QUFFekU7SUFBMkssdUNBQWM7SUFJckw7UUFKSixpQkFzQ0M7UUFqQ08saUJBQU8sQ0FBQztRQUpKLGVBQVUsR0FBbUIsSUFBSSxHQUFHLEVBQWEsQ0FBQztRQUt0RCxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FDaEIsMkJBQVUsQ0FBQyxNQUFNLENBQUM7WUFDZCxLQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBWCxDQUFXLENBQUMsQ0FBQztZQUMxQyxLQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUNMLENBQUM7SUFDTixDQUFDO0lBSVMsb0NBQU0sR0FBaEIsVUFBaUIsT0FBaUI7UUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVELHNCQUFjLDZDQUFZO2FBQTFCLGNBQStCLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUV2RCw0Q0FBYyxHQUF0QjtRQUNJLElBQU0sU0FBUyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsVUFBQSxRQUFRO1lBQ3hELE1BQU0sQ0FBQyxVQUFDLE9BQWlCLElBQUssT0FBQSxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUF6QixDQUF5QixDQUFDO1FBQzVELENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFTSw4Q0FBZ0IsR0FBdkIsVUFBd0IsUUFBbUI7UUFBM0MsaUJBUUM7UUFQRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFdEIsTUFBTSxDQUFDLDJCQUFVLENBQUMsTUFBTSxDQUFDO1lBQ3JCLEtBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2pDLEtBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUMxQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDTCwwQkFBQztBQUFELENBQUMsQUF0Q0QsQ0FBMkssK0JBQWMsR0FzQ3hMO0FBdENxQiwyQkFBbUIsc0JBc0N4QyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBEaXNwb3NhYmxlLCBEaXNwb3NhYmxlQmFzZSwgSURpc3Bvc2FibGUgfSBmcm9tICd0cy1kaXNwb3NhYmxlcyc7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUHJvdmlkZXJTZXJ2aWNlQmFzZTxUUHJvdmlkZXIgZXh0ZW5kcyB7IHJlcXVlc3Q6IChvcHRpb25zOiBUUmVxdWVzdCkgPT4gVFJlc3BvbnNlOyB9ICYgSURpc3Bvc2FibGUsIFRSZXF1ZXN0LCBUUmVzcG9uc2UsIFRBZ2dyZWdhdGVSZXNwb25zZT4gZXh0ZW5kcyBEaXNwb3NhYmxlQmFzZSB7XHJcbiAgICBwcml2YXRlIF9wcm92aWRlcnM6IFNldDxUUHJvdmlkZXI+ID0gbmV3IFNldDxUUHJvdmlkZXI+KCk7XHJcbiAgICBwcml2YXRlIF9pbnZva2U6IChvcHRpb25zOiBUUmVxdWVzdCkgPT4gVEFnZ3JlZ2F0ZVJlc3BvbnNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQoXHJcbiAgICAgICAgICAgIERpc3Bvc2FibGUuY3JlYXRlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Byb3ZpZGVycy5mb3JFYWNoKHggPT4geC5kaXNwb3NlKCkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvdmlkZXJzLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3QgY3JlYXRlSW52b2tlKGNhbGxiYWNrczogKChvcHRpb25zOiBUUmVxdWVzdCkgPT4gVFJlc3BvbnNlKVtdKTogKG9wdGlvbnM6IFRSZXF1ZXN0KSA9PiBUQWdncmVnYXRlUmVzcG9uc2U7XHJcblxyXG4gICAgcHJvdGVjdGVkIGludm9rZShvcHRpb25zOiBUUmVxdWVzdCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZva2Uob3B0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGdldCBoYXNQcm92aWRlcnMoKSB7IHJldHVybiAhIXRoaXMuX3Byb3ZpZGVycy5zaXplOyB9XHJcblxyXG4gICAgcHJpdmF0ZSBfY29tcHV0ZUludm9rZSgpIHtcclxuICAgICAgICBjb25zdCBjYWxsYmFja3MgPSBfLm1hcChfLnRvQXJyYXkodGhpcy5fcHJvdmlkZXJzKSwgcHJvdmlkZXIgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gKG9wdGlvbnM6IFRSZXF1ZXN0KSA9PiBwcm92aWRlci5yZXF1ZXN0KG9wdGlvbnMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX2ludm9rZSA9IHRoaXMuY3JlYXRlSW52b2tlKGNhbGxiYWNrcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlZ2lzdGVyUHJvdmlkZXIocHJvdmlkZXI6IFRQcm92aWRlcikge1xyXG4gICAgICAgIHRoaXMuX3Byb3ZpZGVycy5hZGQocHJvdmlkZXIpO1xyXG4gICAgICAgIHRoaXMuX2NvbXB1dGVJbnZva2UoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIERpc3Bvc2FibGUuY3JlYXRlKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fcHJvdmlkZXJzLmRlbGV0ZShwcm92aWRlcik7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbXB1dGVJbnZva2UoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iXX0=