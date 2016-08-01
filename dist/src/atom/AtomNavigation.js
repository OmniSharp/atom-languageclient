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
var navigationHasLocation = atom_languageservices_1.AtomNavigation.navigationHasLocation, navigationHasRange = atom_languageservices_1.AtomNavigation.navigationHasRange;
var AtomNavigation = (function () {
    function AtomNavigation() {
    }
    AtomNavigation.prototype.navigateTo = function (context) {
        if (navigationHasRange(context)) {
            return atom.workspace.open(context.filePath, { initialLine: context.range.end.row, initialColumn: context.range.end.column });
        }
        else if (navigationHasLocation(location)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXRvbU5hdmlnYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXRvbS9BdG9tTmF2aWdhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7R0FJRztBQUNILHNDQUFtRSx1QkFBdUIsQ0FBQyxDQUFBO0FBQzNGLDJCQUFrQyxrQ0FBa0MsQ0FBQyxDQUFBO0FBQzdELHdGQUFxQixFQUFFLDhFQUFrQixDQUFvQjtBQUlyRTtJQUFBO0lBV0EsQ0FBQztJQVZVLG1DQUFVLEdBQWpCLFVBQWtCLE9BQWlDO1FBQy9DLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLFdBQVcsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsYUFBYSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDbEksQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekMscUNBQXFDO1lBQ3JDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsV0FBVyxFQUFRLE9BQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLGFBQWEsRUFBUSxPQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDOUksQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqRCxDQUFDO0lBQ0wsQ0FBQztJQVpMO1FBQUMsdUJBQVU7UUFDVixrQkFBSyxDQUFDLHVDQUFlLENBQUM7O3NCQUFBO0lBWXZCLHFCQUFDO0FBQUQsQ0FBQyxBQVhELElBV0M7QUFYWSxzQkFBYyxpQkFXMUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiAgQGxpY2Vuc2UgICBNSVRcclxuICogIEBjb3B5cmlnaHQgT21uaVNoYXJwIFRlYW1cclxuICogIEBzdW1tYXJ5ICAgQWRkcyBzdXBwb3J0IGZvciBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L2xhbmd1YWdlLXNlcnZlci1wcm90b2NvbCAoYW5kIG1vcmUhKSB0byBodHRwczovL2F0b20uaW9cclxuICovXHJcbmltcG9ydCB7IEF0b21OYXZpZ2F0aW9uIGFzIEFUT01fTkFWSUdBVElPTiwgSUF0b21OYXZpZ2F0aW9uIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzJztcclxuaW1wb3J0IHsgYWxpYXMsIGluamVjdGFibGUgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvZGVjb3JhdG9ycyc7XHJcbmNvbnN0IHsgbmF2aWdhdGlvbkhhc0xvY2F0aW9uLCBuYXZpZ2F0aW9uSGFzUmFuZ2V9ID0gQVRPTV9OQVZJR0FUSU9OO1xyXG5cclxuQGluamVjdGFibGVcclxuQGFsaWFzKElBdG9tTmF2aWdhdGlvbilcclxuZXhwb3J0IGNsYXNzIEF0b21OYXZpZ2F0aW9uIGltcGxlbWVudHMgSUF0b21OYXZpZ2F0aW9uIHtcclxuICAgIHB1YmxpYyBuYXZpZ2F0ZVRvKGNvbnRleHQ6IEFUT01fTkFWSUdBVElPTi5Mb2NhdGlvbikge1xyXG4gICAgICAgIGlmIChuYXZpZ2F0aW9uSGFzUmFuZ2UoY29udGV4dCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4oY29udGV4dC5maWxlUGF0aCwgeyBpbml0aWFsTGluZTogY29udGV4dC5yYW5nZS5lbmQucm93LCBpbml0aWFsQ29sdW1uOiBjb250ZXh0LnJhbmdlLmVuZC5jb2x1bW4gfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChuYXZpZ2F0aW9uSGFzTG9jYXRpb24obG9jYXRpb24pKSB7XHJcbiAgICAgICAgICAgIC8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnkgKi9cclxuICAgICAgICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4oY29udGV4dC5maWxlUGF0aCwgeyBpbml0aWFsTGluZTogKDxhbnk+Y29udGV4dCkubG9jYXRpb24ucm93LCBpbml0aWFsQ29sdW1uOiAoPGFueT5jb250ZXh0KS5sb2NhdGlvbi5jb2x1bW4gfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4oY29udGV4dC5maWxlUGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==