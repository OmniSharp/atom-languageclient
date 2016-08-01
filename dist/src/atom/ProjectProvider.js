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
var ProjectProvider = (function () {
    function ProjectProvider() {
    }
    ProjectProvider.prototype.getPaths = function () { return atom.project.getPaths(); };
    ProjectProvider.prototype.onDidChangePaths = function (callback) {
        return atom.project.onDidChangePaths(callback);
    };
    ProjectProvider = __decorate([
        decorators_1.injectable,
        decorators_1.alias(atom_languageservices_1.IProjectProvider), 
        __metadata('design:paramtypes', [])
    ], ProjectProvider);
    return ProjectProvider;
}());
exports.ProjectProvider = ProjectProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJvamVjdFByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2F0b20vUHJvamVjdFByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7OztHQUlHO0FBQ0gsc0NBQWlDLHVCQUF1QixDQUFDLENBQUE7QUFDekQsMkJBQWtDLGtDQUFrQyxDQUFDLENBQUE7QUFJckU7SUFBQTtJQUtBLENBQUM7SUFKVSxrQ0FBUSxHQUFmLGNBQW9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM5QywwQ0FBZ0IsR0FBdkIsVUFBd0IsUUFBbUM7UUFDdkQsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQU5MO1FBQUMsdUJBQVU7UUFDVixrQkFBSyxDQUFDLHdDQUFnQixDQUFDOzt1QkFBQTtJQU14QixzQkFBQztBQUFELENBQUMsQUFMRCxJQUtDO0FBTFksdUJBQWUsa0JBSzNCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogIEBsaWNlbnNlICAgTUlUXHJcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG5pbXBvcnQgeyBJUHJvamVjdFByb3ZpZGVyIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzJztcclxuaW1wb3J0IHsgYWxpYXMsIGluamVjdGFibGUgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvZGVjb3JhdG9ycyc7XHJcblxyXG5AaW5qZWN0YWJsZVxyXG5AYWxpYXMoSVByb2plY3RQcm92aWRlcilcclxuZXhwb3J0IGNsYXNzIFByb2plY3RQcm92aWRlciBpbXBsZW1lbnRzIElQcm9qZWN0UHJvdmlkZXIge1xyXG4gICAgcHVibGljIGdldFBhdGhzKCkgeyByZXR1cm4gYXRvbS5wcm9qZWN0LmdldFBhdGhzKCk7IH1cclxuICAgIHB1YmxpYyBvbkRpZENoYW5nZVBhdGhzKGNhbGxiYWNrOiAocGF0aHM6IHN0cmluZ1tdKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgcmV0dXJuIGF0b20ucHJvamVjdC5vbkRpZENoYW5nZVBhdGhzKGNhbGxiYWNrKTtcclxuICAgIH1cclxufVxyXG4iXX0=