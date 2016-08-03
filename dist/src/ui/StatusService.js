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
var decorators_1 = require('atom-languageservices/decorators');
var ts_disposables_1 = require('ts-disposables');
var StatusBarService_1 = require('../atom/StatusBarService');
var StatusBarView_1 = require('./views/StatusBarView');
var StatusService = (function (_super) {
    __extends(StatusService, _super);
    function StatusService(statusBarService) {
        _super.call(this);
        this._statusBarService = statusBarService;
        this._view = new StatusBarView_1.StatusBarView();
        this._disposable.add(this._view, this._statusBarService.addTile({ position: StatusBarService_1.StatusBar.Position.Left, item: this._view.root, priority: -10000 }));
    }
    StatusService = __decorate([
        decorators_1.injectable, 
        __metadata('design:paramtypes', [StatusBarService_1.StatusBarService])
    ], StatusService);
    return StatusService;
}(ts_disposables_1.DisposableBase));
exports.StatusService = StatusService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhdHVzU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9TdGF0dXNTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCwyQkFBMkIsa0NBQWtDLENBQUMsQ0FBQTtBQUM5RCwrQkFBK0IsZ0JBQWdCLENBQUMsQ0FBQTtBQUNoRCxpQ0FBNEMsMEJBQTBCLENBQUMsQ0FBQTtBQUN2RSw4QkFBOEIsdUJBQXVCLENBQUMsQ0FBQTtBQUd0RDtJQUFtQyxpQ0FBYztJQUk3Qyx1QkFBWSxnQkFBa0M7UUFDMUMsaUJBQU8sQ0FBQztRQUNSLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxnQkFBZ0IsQ0FBQztRQUUxQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksNkJBQWEsRUFBRSxDQUFDO1FBRWpDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUNoQixJQUFJLENBQUMsS0FBSyxFQUNWLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsRUFBRSxRQUFRLEVBQUUsNEJBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUNqSCxDQUFDO0lBQ04sQ0FBQztJQWZMO1FBQUMsdUJBQVU7O3FCQUFBO0lBZ0JYLG9CQUFDO0FBQUQsQ0FBQyxBQWZELENBQW1DLCtCQUFjLEdBZWhEO0FBZlkscUJBQWEsZ0JBZXpCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogIEBsaWNlbnNlICAgTUlUXHJcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG5pbXBvcnQgeyBpbmplY3RhYmxlIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL2RlY29yYXRvcnMnO1xyXG5pbXBvcnQgeyBEaXNwb3NhYmxlQmFzZSB9IGZyb20gJ3RzLWRpc3Bvc2FibGVzJztcclxuaW1wb3J0IHsgU3RhdHVzQmFyLCBTdGF0dXNCYXJTZXJ2aWNlIH0gZnJvbSAnLi4vYXRvbS9TdGF0dXNCYXJTZXJ2aWNlJztcclxuaW1wb3J0IHsgU3RhdHVzQmFyVmlldyB9IGZyb20gJy4vdmlld3MvU3RhdHVzQmFyVmlldyc7XHJcblxyXG5AaW5qZWN0YWJsZVxyXG5leHBvcnQgY2xhc3MgU3RhdHVzU2VydmljZSBleHRlbmRzIERpc3Bvc2FibGVCYXNlIHtcclxuICAgIHByaXZhdGUgX3ZpZXc6IFN0YXR1c0JhclZpZXc7XHJcbiAgICBwcml2YXRlIF9zdGF0dXNCYXJTZXJ2aWNlOiBTdGF0dXNCYXJTZXJ2aWNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHN0YXR1c0JhclNlcnZpY2U6IFN0YXR1c0JhclNlcnZpY2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX3N0YXR1c0JhclNlcnZpY2UgPSBzdGF0dXNCYXJTZXJ2aWNlO1xyXG5cclxuICAgICAgICB0aGlzLl92aWV3ID0gbmV3IFN0YXR1c0JhclZpZXcoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQoXHJcbiAgICAgICAgICAgIHRoaXMuX3ZpZXcsXHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXR1c0JhclNlcnZpY2UuYWRkVGlsZSh7IHBvc2l0aW9uOiBTdGF0dXNCYXIuUG9zaXRpb24uTGVmdCwgaXRlbTogdGhpcy5fdmlldy5yb290LCBwcmlvcml0eTogLTEwMDAwIH0pXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG4iXX0=