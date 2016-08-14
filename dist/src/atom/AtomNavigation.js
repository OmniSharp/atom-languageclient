"use strict";
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
var atom_languageservices_1 = require('atom-languageservices');
var decorators_1 = require('atom-languageservices/decorators');
var AtomNavigation = (function () {
    function AtomNavigation() {
    }
    AtomNavigation.prototype.navigateTo = function (context) {
        if (atom_languageservices_1.navigationHasRange(context)) {
            return atom.workspace.open(context.filePath, { initialLine: context.range.end.row, initialColumn: context.range.end.column });
        }
        else if (atom_languageservices_1.navigationHasLocation(context)) {
            /* tslint:disable-next-line:no-any */
            return atom.workspace.open(context.filePath, { initialLine: context.location.row, initialColumn: context.location.column });
        }
        else {
            return atom.workspace.open(context.filePath);
        }
    };
    AtomNavigation = __decorate([
        decorators_1.injectable,
        decorators_1.alias(atom_languageservices_1.IAtomNavigation), 
        __metadata('design:paramtypes', [])
    ], AtomNavigation);
    return AtomNavigation;
}());
exports.AtomNavigation = AtomNavigation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXRvbU5hdmlnYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXRvbS9BdG9tTmF2aWdhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7R0FJRztBQUNILHNDQUEyRSx1QkFBdUIsQ0FBQyxDQUFBO0FBQ25HLDJCQUFrQyxrQ0FBa0MsQ0FBQyxDQUFBO0FBSXJFO0lBQUE7SUFXQSxDQUFDO0lBVlUsbUNBQVUsR0FBakIsVUFBa0IsT0FBaUM7UUFDL0MsRUFBRSxDQUFDLENBQUMsMENBQWtCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsV0FBVyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxhQUFhLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUNsSSxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLDZDQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QyxxQ0FBcUM7WUFDckMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxXQUFXLEVBQVEsT0FBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsYUFBYSxFQUFRLE9BQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUM5SSxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pELENBQUM7SUFDTCxDQUFDO0lBWkw7UUFBQyx1QkFBVTtRQUNWLGtCQUFLLENBQUMsdUNBQWUsQ0FBQzs7c0JBQUE7SUFZdkIscUJBQUM7QUFBRCxDQUFDLEFBWEQsSUFXQztBQVhZLHNCQUFjLGlCQVcxQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0IHsgSUF0b21OYXZpZ2F0aW9uLCBuYXZpZ2F0aW9uSGFzTG9jYXRpb24sIG5hdmlnYXRpb25IYXNSYW5nZSB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCB7IGFsaWFzLCBpbmplY3RhYmxlIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL2RlY29yYXRvcnMnO1xyXG5cclxuQGluamVjdGFibGVcclxuQGFsaWFzKElBdG9tTmF2aWdhdGlvbilcclxuZXhwb3J0IGNsYXNzIEF0b21OYXZpZ2F0aW9uIGltcGxlbWVudHMgSUF0b21OYXZpZ2F0aW9uIHtcclxuICAgIHB1YmxpYyBuYXZpZ2F0ZVRvKGNvbnRleHQ6IElBdG9tTmF2aWdhdGlvbi5Mb2NhdGlvbikge1xyXG4gICAgICAgIGlmIChuYXZpZ2F0aW9uSGFzUmFuZ2UoY29udGV4dCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4oY29udGV4dC5maWxlUGF0aCwgeyBpbml0aWFsTGluZTogY29udGV4dC5yYW5nZS5lbmQucm93LCBpbml0aWFsQ29sdW1uOiBjb250ZXh0LnJhbmdlLmVuZC5jb2x1bW4gfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChuYXZpZ2F0aW9uSGFzTG9jYXRpb24oY29udGV4dCkpIHtcclxuICAgICAgICAgICAgLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueSAqL1xyXG4gICAgICAgICAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3Blbihjb250ZXh0LmZpbGVQYXRoLCB7IGluaXRpYWxMaW5lOiAoPGFueT5jb250ZXh0KS5sb2NhdGlvbi5yb3csIGluaXRpYWxDb2x1bW46ICg8YW55PmNvbnRleHQpLmxvY2F0aW9uLmNvbHVtbiB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3Blbihjb250ZXh0LmZpbGVQYXRoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19