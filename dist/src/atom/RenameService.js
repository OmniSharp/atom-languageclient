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
var _ = require('lodash');
var rxjs_1 = require('rxjs');
var atom_languageservices_1 = require('atom-languageservices');
var decorators_1 = require('atom-languageservices/decorators');
var _ProviderServiceBase_1 = require('./_ProviderServiceBase');
var decorators_2 = require('../decorators');
var AtomChanges_1 = require('./AtomChanges');
var AtomCommands_1 = require('./AtomCommands');
var AtomNavigation_1 = require('./AtomNavigation');
var AtomTextEditorSource_1 = require('./AtomTextEditorSource');
var CommandsService_1 = require('./CommandsService');
var RenameView_1 = require('./views/RenameView');
var WaitService_1 = require('./WaitService');
var RenameService = (function (_super) {
    __extends(RenameService, _super);
    function RenameService(changes, navigation, commands, atomCommands, source, waitService) {
        _super.call(this);
        this._changes = changes;
        this._commands = commands;
        this._atomCommands = atomCommands;
        this._navigation = navigation;
        this._source = source;
        this._waitService = waitService;
    }
    RenameService.prototype.onEnabled = function () {
        var _this = this;
        return this._commands.add(atom_languageservices_1.CommandType.TextEditor, 'rename', 'f2', function () { return _this.open(); });
    };
    RenameService.prototype.createInvoke = function (callbacks) {
        return function (options) {
            return rxjs_1.Observable.from(_.over(callbacks)(options))
                .mergeMap(_.identity)
                .reduce(function (acc, results) {
                return acc.concat(results);
            }, []);
        };
    };
    RenameService.prototype.open = function () {
        var _this = this;
        var editor = this._source.activeTextEditor;
        if (editor) {
            var word = editor.getWordUnderCursor();
            word = _.trim(word, '()[]{}');
            var view = new RenameView_1.RenameView(this._atomCommands, {
                word: word,
                editor: editor,
                location: editor.getCursorBufferPosition()
            });
            view.rename$
                .take(1)
                .concatMap(function (options) {
                var result = _this.invoke(options)
                    .concatMap(function (changes) {
                    return _this._changes.applyWorkspaceChanges(changes);
                })
                    .toPromise();
                _this._waitService.waitUntil(result);
                return result;
            })
                .toPromise();
        }
    };
    RenameService = __decorate([
        decorators_1.injectable,
        decorators_1.alias(atom_languageservices_1.IRenameService),
        decorators_2.atomConfig({
            default: true,
            description: 'Adds support for renaming symbols'
        }), 
        __metadata('design:paramtypes', [AtomChanges_1.AtomChanges, AtomNavigation_1.AtomNavigation, CommandsService_1.CommandsService, AtomCommands_1.AtomCommands, AtomTextEditorSource_1.AtomTextEditorSource, WaitService_1.WaitService])
    ], RenameService);
    return RenameService;
}(_ProviderServiceBase_1.ProviderServiceBase));
exports.RenameService = RenameService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVuYW1lU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hdG9tL1JlbmFtZVNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7R0FJRztBQUNILElBQVksQ0FBQyxXQUFNLFFBQVEsQ0FBQyxDQUFBO0FBQzVCLHFCQUEyQixNQUFNLENBQUMsQ0FBQTtBQUNsQyxzQ0FBMkUsdUJBQXVCLENBQUMsQ0FBQTtBQUNuRywyQkFBa0Msa0NBQWtDLENBQUMsQ0FBQTtBQUNyRSxxQ0FBb0Msd0JBQXdCLENBQUMsQ0FBQTtBQUM3RCwyQkFBMkIsZUFBZSxDQUFDLENBQUE7QUFDM0MsNEJBQTRCLGVBQWUsQ0FBQyxDQUFBO0FBQzVDLDZCQUE2QixnQkFBZ0IsQ0FBQyxDQUFBO0FBQzlDLCtCQUErQixrQkFBa0IsQ0FBQyxDQUFBO0FBQ2xELHFDQUFxQyx3QkFBd0IsQ0FBQyxDQUFBO0FBQzlELGdDQUFnQyxtQkFBbUIsQ0FBQyxDQUFBO0FBQ3BELDJCQUEyQixvQkFBb0IsQ0FBQyxDQUFBO0FBQ2hELDRCQUE0QixlQUFlLENBQUMsQ0FBQTtBQVE1QztJQUNZLGlDQUErSDtJQVN2SSx1QkFBWSxPQUFvQixFQUFFLFVBQTBCLEVBQUUsUUFBeUIsRUFBRSxZQUEwQixFQUFFLE1BQTRCLEVBQUUsV0FBd0I7UUFDdkssaUJBQU8sQ0FBQztRQUNSLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO0lBQ3BDLENBQUM7SUFFTSxpQ0FBUyxHQUFoQjtRQUFBLGlCQUVDO1FBREcsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLG1DQUFXLENBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsY0FBTSxPQUFBLEtBQUksQ0FBQyxJQUFJLEVBQUUsRUFBWCxDQUFXLENBQUMsQ0FBQztJQUN6RixDQUFDO0lBRVMsb0NBQVksR0FBdEIsVUFBdUIsU0FBZ0Y7UUFDbkcsTUFBTSxDQUFDLFVBQUMsT0FBd0I7WUFDNUIsTUFBTSxDQUFDLGlCQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQzdDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO2lCQUNwQixNQUFNLENBQ1AsVUFBQyxHQUFHLEVBQUUsT0FBTztnQkFDVCxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMvQixDQUFDLEVBQ0QsRUFBRSxDQUFDLENBQUM7UUFDWixDQUFDLENBQUM7SUFDTixDQUFDO0lBRU0sNEJBQUksR0FBWDtRQUFBLGlCQXVCQztRQXRCRyxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDO1FBQzdDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDVCxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUN2QyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDOUIsSUFBTSxJQUFJLEdBQUcsSUFBSSx1QkFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQzVDLFVBQUk7Z0JBQ0osTUFBTSxFQUFFLE1BQU07Z0JBQ2QsUUFBUSxFQUFFLE1BQU8sQ0FBQyx1QkFBdUIsRUFBRTthQUM5QyxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsT0FBTztpQkFDUCxJQUFJLENBQUMsQ0FBQyxDQUFDO2lCQUNQLFNBQVMsQ0FBQyxVQUFBLE9BQU87Z0JBQ2QsSUFBTSxNQUFNLEdBQUcsS0FBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7cUJBQzlCLFNBQVMsQ0FBQyxVQUFBLE9BQU87b0JBQ2QsTUFBTSxDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3hELENBQUMsQ0FBQztxQkFDRCxTQUFTLEVBQUUsQ0FBQztnQkFDakIsS0FBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3BDLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDbEIsQ0FBQyxDQUFDO2lCQUNELFNBQVMsRUFBRSxDQUFDO1FBQ3JCLENBQUM7SUFDTCxDQUFDO0lBakVMO1FBQUMsdUJBQVU7UUFDVixrQkFBSyxDQUFDLHNDQUFjLENBQUM7UUFDckIsdUJBQVUsQ0FBQztZQUNSLE9BQU8sRUFBRSxJQUFJO1lBQ2IsV0FBVyxFQUFFLG1DQUFtQztTQUNuRCxDQUFDOztxQkFBQTtJQTZERixvQkFBQztBQUFELENBQUMsQUE1REQsQ0FDWSwwQ0FBbUIsR0EyRDlCO0FBNURZLHFCQUFhLGdCQTREekIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiAgQGxpY2Vuc2UgICBNSVRcclxuICogIEBjb3B5cmlnaHQgT21uaVNoYXJwIFRlYW1cclxuICogIEBzdW1tYXJ5ICAgQWRkcyBzdXBwb3J0IGZvciBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L2xhbmd1YWdlLXNlcnZlci1wcm90b2NvbCAoYW5kIG1vcmUhKSB0byBodHRwczovL2F0b20uaW9cclxuICovXHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBDb21tYW5kVHlwZSwgSVJlbmFtZVByb3ZpZGVyLCBJUmVuYW1lU2VydmljZSwgUmVuYW1lLCBUZXh0IH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzJztcclxuaW1wb3J0IHsgYWxpYXMsIGluamVjdGFibGUgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvZGVjb3JhdG9ycyc7XHJcbmltcG9ydCB7IFByb3ZpZGVyU2VydmljZUJhc2UgfSBmcm9tICcuL19Qcm92aWRlclNlcnZpY2VCYXNlJztcclxuaW1wb3J0IHsgYXRvbUNvbmZpZyB9IGZyb20gJy4uL2RlY29yYXRvcnMnO1xyXG5pbXBvcnQgeyBBdG9tQ2hhbmdlcyB9IGZyb20gJy4vQXRvbUNoYW5nZXMnO1xyXG5pbXBvcnQgeyBBdG9tQ29tbWFuZHMgfSBmcm9tICcuL0F0b21Db21tYW5kcyc7XHJcbmltcG9ydCB7IEF0b21OYXZpZ2F0aW9uIH0gZnJvbSAnLi9BdG9tTmF2aWdhdGlvbic7XHJcbmltcG9ydCB7IEF0b21UZXh0RWRpdG9yU291cmNlIH0gZnJvbSAnLi9BdG9tVGV4dEVkaXRvclNvdXJjZSc7XHJcbmltcG9ydCB7IENvbW1hbmRzU2VydmljZSB9IGZyb20gJy4vQ29tbWFuZHNTZXJ2aWNlJztcclxuaW1wb3J0IHsgUmVuYW1lVmlldyB9IGZyb20gJy4vdmlld3MvUmVuYW1lVmlldyc7XHJcbmltcG9ydCB7IFdhaXRTZXJ2aWNlIH0gZnJvbSAnLi9XYWl0U2VydmljZSc7XHJcblxyXG5AaW5qZWN0YWJsZVxyXG5AYWxpYXMoSVJlbmFtZVNlcnZpY2UpXHJcbkBhdG9tQ29uZmlnKHtcclxuICAgIGRlZmF1bHQ6IHRydWUsXHJcbiAgICBkZXNjcmlwdGlvbjogJ0FkZHMgc3VwcG9ydCBmb3IgcmVuYW1pbmcgc3ltYm9scydcclxufSlcclxuZXhwb3J0IGNsYXNzIFJlbmFtZVNlcnZpY2VcclxuICAgIGV4dGVuZHMgUHJvdmlkZXJTZXJ2aWNlQmFzZTxJUmVuYW1lUHJvdmlkZXIsIFJlbmFtZS5JUmVxdWVzdCwgT2JzZXJ2YWJsZTxUZXh0LklXb3Jrc3BhY2VDaGFuZ2VbXT4sIE9ic2VydmFibGU8VGV4dC5JV29ya3NwYWNlQ2hhbmdlW10+PlxyXG4gICAgaW1wbGVtZW50cyBJUmVuYW1lU2VydmljZSB7XHJcbiAgICBwcml2YXRlIF9uYXZpZ2F0aW9uOiBBdG9tTmF2aWdhdGlvbjtcclxuICAgIHByaXZhdGUgX2NvbW1hbmRzOiBDb21tYW5kc1NlcnZpY2U7XHJcbiAgICBwcml2YXRlIF9hdG9tQ29tbWFuZHM6IEF0b21Db21tYW5kcztcclxuICAgIHByaXZhdGUgX2NoYW5nZXM6IEF0b21DaGFuZ2VzO1xyXG4gICAgcHJpdmF0ZSBfc291cmNlOiBBdG9tVGV4dEVkaXRvclNvdXJjZTtcclxuICAgIHByaXZhdGUgX3dhaXRTZXJ2aWNlOiBXYWl0U2VydmljZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjaGFuZ2VzOiBBdG9tQ2hhbmdlcywgbmF2aWdhdGlvbjogQXRvbU5hdmlnYXRpb24sIGNvbW1hbmRzOiBDb21tYW5kc1NlcnZpY2UsIGF0b21Db21tYW5kczogQXRvbUNvbW1hbmRzLCBzb3VyY2U6IEF0b21UZXh0RWRpdG9yU291cmNlLCB3YWl0U2VydmljZTogV2FpdFNlcnZpY2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2NoYW5nZXMgPSBjaGFuZ2VzO1xyXG4gICAgICAgIHRoaXMuX2NvbW1hbmRzID0gY29tbWFuZHM7XHJcbiAgICAgICAgdGhpcy5fYXRvbUNvbW1hbmRzID0gYXRvbUNvbW1hbmRzO1xyXG4gICAgICAgIHRoaXMuX25hdmlnYXRpb24gPSBuYXZpZ2F0aW9uO1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZSA9IHNvdXJjZTtcclxuICAgICAgICB0aGlzLl93YWl0U2VydmljZSA9IHdhaXRTZXJ2aWNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkVuYWJsZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbW1hbmRzLmFkZChDb21tYW5kVHlwZS5UZXh0RWRpdG9yLCAncmVuYW1lJywgJ2YyJywgKCkgPT4gdGhpcy5vcGVuKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjcmVhdGVJbnZva2UoY2FsbGJhY2tzOiAoKG9wdGlvbnM6IFJlbmFtZS5JUmVxdWVzdCkgPT4gT2JzZXJ2YWJsZTxUZXh0LklXb3Jrc3BhY2VDaGFuZ2VbXT4pW10pIHtcclxuICAgICAgICByZXR1cm4gKG9wdGlvbnM6IFJlbmFtZS5JUmVxdWVzdCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5mcm9tKF8ub3ZlcihjYWxsYmFja3MpKG9wdGlvbnMpKVxyXG4gICAgICAgICAgICAgICAgLm1lcmdlTWFwKF8uaWRlbnRpdHkpXHJcbiAgICAgICAgICAgICAgICAucmVkdWNlKFxyXG4gICAgICAgICAgICAgICAgKGFjYywgcmVzdWx0cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhY2MuY29uY2F0KHJlc3VsdHMpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFtdKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvcGVuKCkge1xyXG4gICAgICAgIGNvbnN0IGVkaXRvciA9IHRoaXMuX3NvdXJjZS5hY3RpdmVUZXh0RWRpdG9yO1xyXG4gICAgICAgIGlmIChlZGl0b3IpIHtcclxuICAgICAgICAgICAgbGV0IHdvcmQgPSBlZGl0b3IuZ2V0V29yZFVuZGVyQ3Vyc29yKCk7XHJcbiAgICAgICAgICAgIHdvcmQgPSBfLnRyaW0od29yZCwgJygpW117fScpO1xyXG4gICAgICAgICAgICBjb25zdCB2aWV3ID0gbmV3IFJlbmFtZVZpZXcodGhpcy5fYXRvbUNvbW1hbmRzLCB7XHJcbiAgICAgICAgICAgICAgICB3b3JkLFxyXG4gICAgICAgICAgICAgICAgZWRpdG9yOiBlZGl0b3IsXHJcbiAgICAgICAgICAgICAgICBsb2NhdGlvbjogZWRpdG9yIS5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB2aWV3LnJlbmFtZSRcclxuICAgICAgICAgICAgICAgIC50YWtlKDEpXHJcbiAgICAgICAgICAgICAgICAuY29uY2F0TWFwKG9wdGlvbnMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuaW52b2tlKG9wdGlvbnMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jb25jYXRNYXAoY2hhbmdlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hhbmdlcy5hcHBseVdvcmtzcGFjZUNoYW5nZXMoY2hhbmdlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50b1Byb21pc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl93YWl0U2VydmljZS53YWl0VW50aWwocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC50b1Byb21pc2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19