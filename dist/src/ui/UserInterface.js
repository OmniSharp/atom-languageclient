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
var StatusService_1 = require('./StatusService');
var UserInterface = (function (_super) {
    __extends(UserInterface, _super);
    function UserInterface(statusService) {
        _super.call(this);
        this._statusService = statusService;
    }
    UserInterface = __decorate([
        decorators_1.injectable, 
        __metadata('design:paramtypes', [StatusService_1.StatusService])
    ], UserInterface);
    return UserInterface;
}(ts_disposables_1.DisposableBase));
exports.UserInterface = UserInterface;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlckludGVyZmFjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9Vc2VySW50ZXJmYWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCwyQkFBMkIsa0NBQWtDLENBQUMsQ0FBQTtBQUM5RCwrQkFBK0IsZ0JBQWdCLENBQUMsQ0FBQTtBQUNoRCw4QkFBOEIsaUJBQWlCLENBQUMsQ0FBQTtBQUdoRDtJQUFtQyxpQ0FBYztJQUU3Qyx1QkFBWSxhQUE0QjtRQUNwQyxpQkFBTyxDQUFDO1FBQ1IsSUFBSSxDQUFDLGNBQWMsR0FBRyxhQUFhLENBQUM7SUFDeEMsQ0FBQztJQU5MO1FBQUMsdUJBQVU7O3FCQUFBO0lBT1gsb0JBQUM7QUFBRCxDQUFDLEFBTkQsQ0FBbUMsK0JBQWMsR0FNaEQ7QUFOWSxxQkFBYSxnQkFNekIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiAgQGxpY2Vuc2UgICBNSVRcclxuICogIEBjb3B5cmlnaHQgT21uaVNoYXJwIFRlYW1cclxuICogIEBzdW1tYXJ5ICAgQWRkcyBzdXBwb3J0IGZvciBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L2xhbmd1YWdlLXNlcnZlci1wcm90b2NvbCAoYW5kIG1vcmUhKSB0byBodHRwczovL2F0b20uaW9cclxuICovXHJcbmltcG9ydCB7IGluamVjdGFibGUgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvZGVjb3JhdG9ycyc7XHJcbmltcG9ydCB7IERpc3Bvc2FibGVCYXNlIH0gZnJvbSAndHMtZGlzcG9zYWJsZXMnO1xyXG5pbXBvcnQgeyBTdGF0dXNTZXJ2aWNlIH0gZnJvbSAnLi9TdGF0dXNTZXJ2aWNlJztcclxuXHJcbkBpbmplY3RhYmxlXHJcbmV4cG9ydCBjbGFzcyBVc2VySW50ZXJmYWNlIGV4dGVuZHMgRGlzcG9zYWJsZUJhc2Uge1xyXG4gICAgcHJpdmF0ZSBfc3RhdHVzU2VydmljZTogU3RhdHVzU2VydmljZTtcclxuICAgIGNvbnN0cnVjdG9yKHN0YXR1c1NlcnZpY2U6IFN0YXR1c1NlcnZpY2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX3N0YXR1c1NlcnZpY2UgPSBzdGF0dXNTZXJ2aWNlO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==