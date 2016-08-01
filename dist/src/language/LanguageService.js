"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ts_disposables_1 = require('ts-disposables');
/**
 * Defines the common interface that a module can then consume to interact with us.
 */
var LanguageService = (function (_super) {
    __extends(LanguageService, _super);
    function LanguageService(resolver) {
        _super.call(this);
        this._resolver = resolver;
    }
    Object.defineProperty(LanguageService.prototype, "resolver", {
        get: function () { return this._resolver; },
        enumerable: true,
        configurable: true
    });
    return LanguageService;
}(ts_disposables_1.DisposableBase));
exports.LanguageService = LanguageService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFuZ3VhZ2VTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xhbmd1YWdlL0xhbmd1YWdlU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFNQSwrQkFBK0IsZ0JBQWdCLENBQUMsQ0FBQTtBQUVoRDs7R0FFRztBQUNIO0lBQXFDLG1DQUFjO0lBRy9DLHlCQUFZLFFBQW1CO1FBQzNCLGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztJQUM5QixDQUFDO0lBRUQsc0JBQVcscUNBQVE7YUFBbkIsY0FBd0IsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUNwRCxzQkFBQztBQUFELENBQUMsQUFURCxDQUFxQywrQkFBYyxHQVNsRDtBQVRZLHVCQUFlLGtCQVMzQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0IHsgSUxhbmd1YWdlU2VydmljZSwgSVJlc29sdmVyIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzJztcclxuaW1wb3J0IHsgRGlzcG9zYWJsZUJhc2UgfSBmcm9tICd0cy1kaXNwb3NhYmxlcyc7XHJcblxyXG4vKipcclxuICogRGVmaW5lcyB0aGUgY29tbW9uIGludGVyZmFjZSB0aGF0IGEgbW9kdWxlIGNhbiB0aGVuIGNvbnN1bWUgdG8gaW50ZXJhY3Qgd2l0aCB1cy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBMYW5ndWFnZVNlcnZpY2UgZXh0ZW5kcyBEaXNwb3NhYmxlQmFzZSBpbXBsZW1lbnRzIElMYW5ndWFnZVNlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSBfcmVzb2x2ZXI6IElSZXNvbHZlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihyZXNvbHZlcjogSVJlc29sdmVyKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9yZXNvbHZlciA9IHJlc29sdmVyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcmVzb2x2ZXIoKSB7IHJldHVybiB0aGlzLl9yZXNvbHZlcjsgfVxyXG59XHJcbiJdfQ==