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
/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
var decorators_1 = require('atom-languageservices/decorators');
var ts_disposables_1 = require('ts-disposables');
var ActiveTextEditorProvider_1 = require('./ActiveTextEditorProvider');
var TextEditorProvider_1 = require('./TextEditorProvider');
var OmniService = (function (_super) {
    __extends(OmniService, _super);
    function OmniService(activeEditorProvider, editorsProvider) {
        _super.call(this);
        this._activeEditorsProvider = activeEditorProvider;
        this._editorsProvider = editorsProvider;
    }
    Object.defineProperty(OmniService.prototype, "active", {
        get: function () { return this._activeEditorsProvider; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OmniService.prototype, "editors", {
        get: function () { return this._editorsProvider; },
        enumerable: true,
        configurable: true
    });
    OmniService = __decorate([
        decorators_1.injectable, 
        __metadata('design:paramtypes', [ActiveTextEditorProvider_1.ActiveTextEditorProvider, TextEditorProvider_1.TextEditorProvider])
    ], OmniService);
    return OmniService;
}(ts_disposables_1.DisposableBase));
exports.OmniService = OmniService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT21uaVNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvb21uaS9PbW5pU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztHQUlHO0FBQ0gsMkJBQTJCO0FBQzNCLDJCQUEyQixrQ0FBa0MsQ0FBQyxDQUFBO0FBQzlELCtCQUErQixnQkFBZ0IsQ0FBQyxDQUFBO0FBQ2hELHlDQUFvRSw0QkFBNEIsQ0FBQyxDQUFBO0FBQ2pHLG1DQUF3RCxzQkFBc0IsQ0FBQyxDQUFBO0FBUS9FO0lBQWlDLCtCQUFjO0lBSTNDLHFCQUNJLG9CQUE4QyxFQUM5QyxlQUFtQztRQUVuQyxpQkFBTyxDQUFDO1FBQ1IsSUFBSSxDQUFDLHNCQUFzQixHQUFHLG9CQUFvQixDQUFDO1FBQ25ELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxlQUFlLENBQUM7SUFDNUMsQ0FBQztJQUVELHNCQUFXLCtCQUFNO2FBQWpCLGNBQXNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUMzRCxzQkFBVyxnQ0FBTzthQUFsQixjQUF1QixNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFmMUQ7UUFBQyx1QkFBVTs7bUJBQUE7SUFnQlgsa0JBQUM7QUFBRCxDQUFDLEFBZkQsQ0FBaUMsK0JBQWMsR0FlOUM7QUFmWSxtQkFBVyxjQWV2QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuLyogdHNsaW50OmRpc2FibGU6bm8tYW55ICovXHJcbmltcG9ydCB7IGluamVjdGFibGUgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvZGVjb3JhdG9ycyc7XHJcbmltcG9ydCB7IERpc3Bvc2FibGVCYXNlIH0gZnJvbSAndHMtZGlzcG9zYWJsZXMnO1xyXG5pbXBvcnQgeyBBY3RpdmVUZXh0RWRpdG9yUHJvdmlkZXIsIElBY3RpdmVUZXh0RWRpdG9yUHJvdmlkZXIgfSBmcm9tICcuL0FjdGl2ZVRleHRFZGl0b3JQcm92aWRlcic7XHJcbmltcG9ydCB7IElUZXh0RWRpdG9yUHJvdmlkZXIsIFRleHRFZGl0b3JQcm92aWRlciB9IGZyb20gJy4vVGV4dEVkaXRvclByb3ZpZGVyJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU9tbmlTZXJ2aWNlIHtcclxuICAgIHJlYWRvbmx5IGFjdGl2ZTogSUFjdGl2ZVRleHRFZGl0b3JQcm92aWRlcjtcclxuICAgIHJlYWRvbmx5IGVkaXRvcnM6IElUZXh0RWRpdG9yUHJvdmlkZXI7XHJcbn1cclxuXHJcbkBpbmplY3RhYmxlXHJcbmV4cG9ydCBjbGFzcyBPbW5pU2VydmljZSBleHRlbmRzIERpc3Bvc2FibGVCYXNlIGltcGxlbWVudHMgSU9tbmlTZXJ2aWNlIHtcclxuICAgIHByaXZhdGUgX2FjdGl2ZUVkaXRvcnNQcm92aWRlcjogQWN0aXZlVGV4dEVkaXRvclByb3ZpZGVyO1xyXG4gICAgcHJpdmF0ZSBfZWRpdG9yc1Byb3ZpZGVyOiBUZXh0RWRpdG9yUHJvdmlkZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgYWN0aXZlRWRpdG9yUHJvdmlkZXI6IEFjdGl2ZVRleHRFZGl0b3JQcm92aWRlcixcclxuICAgICAgICBlZGl0b3JzUHJvdmlkZXI6IFRleHRFZGl0b3JQcm92aWRlclxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9hY3RpdmVFZGl0b3JzUHJvdmlkZXIgPSBhY3RpdmVFZGl0b3JQcm92aWRlcjtcclxuICAgICAgICB0aGlzLl9lZGl0b3JzUHJvdmlkZXIgPSBlZGl0b3JzUHJvdmlkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBhY3RpdmUoKSB7IHJldHVybiB0aGlzLl9hY3RpdmVFZGl0b3JzUHJvdmlkZXI7IH1cclxuICAgIHB1YmxpYyBnZXQgZWRpdG9ycygpIHsgcmV0dXJuIHRoaXMuX2VkaXRvcnNQcm92aWRlcjsgfVxyXG59XHJcbiJdfQ==