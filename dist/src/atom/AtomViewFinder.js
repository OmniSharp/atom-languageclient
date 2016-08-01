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
/* tslint:disable:no-any */
var atom_languageservices_1 = require('atom-languageservices');
var decorators_1 = require('atom-languageservices/decorators');
var AtomViewFinder = (function () {
    function AtomViewFinder() {
    }
    AtomViewFinder.prototype.getView = function (item) {
        return atom.views.getView(item);
    };
    AtomViewFinder = __decorate([
        decorators_1.injectable,
        decorators_1.alias(atom_languageservices_1.IAtomViewFinder), 
        __metadata('design:paramtypes', [])
    ], AtomViewFinder);
    return AtomViewFinder;
}());
exports.AtomViewFinder = AtomViewFinder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXRvbVZpZXdGaW5kZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXRvbS9BdG9tVmlld0ZpbmRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7R0FJRztBQUNILDJCQUEyQjtBQUMzQixzQ0FBZ0MsdUJBQXVCLENBQUMsQ0FBQTtBQUN4RCwyQkFBa0Msa0NBQWtDLENBQUMsQ0FBQTtBQUlyRTtJQUFBO0lBTUEsQ0FBQztJQUhVLGdDQUFPLEdBQWQsVUFBZSxJQUFTO1FBQ3BCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBUEw7UUFBQyx1QkFBVTtRQUNWLGtCQUFLLENBQUMsdUNBQWUsQ0FBQzs7c0JBQUE7SUFPdkIscUJBQUM7QUFBRCxDQUFDLEFBTkQsSUFNQztBQU5ZLHNCQUFjLGlCQU0xQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuLyogdHNsaW50OmRpc2FibGU6bm8tYW55ICovXHJcbmltcG9ydCB7IElBdG9tVmlld0ZpbmRlciB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCB7IGFsaWFzLCBpbmplY3RhYmxlIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL2RlY29yYXRvcnMnO1xyXG5cclxuQGluamVjdGFibGVcclxuQGFsaWFzKElBdG9tVmlld0ZpbmRlcilcclxuZXhwb3J0IGNsYXNzIEF0b21WaWV3RmluZGVyIGltcGxlbWVudHMgSUF0b21WaWV3RmluZGVyIHtcclxuICAgIHB1YmxpYyBnZXRWaWV3KGl0ZW06IGFueSk6IEhUTUxFbGVtZW50O1xyXG4gICAgcHVibGljIGdldFZpZXc8VCBleHRlbmRzIEVsZW1lbnQ+KGl0ZW06IGFueSk6IFQ7XHJcbiAgICBwdWJsaWMgZ2V0VmlldyhpdGVtOiBhbnkpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiBhdG9tLnZpZXdzLmdldFZpZXcoaXRlbSk7XHJcbiAgICB9XHJcbn1cclxuIl19