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
var Services = require('atom-languageservices');
var decorators_1 = require('atom-languageservices/decorators');
var _ProviderServiceBase_1 = require('./_ProviderServiceBase');
var AtomChanges_1 = require('./AtomChanges');
var AtomCommands_1 = require('./AtomCommands');
var AtomNavigation_1 = require('./AtomNavigation');
var AtomTextEditorSource_1 = require('./AtomTextEditorSource');
var RenameView_1 = require('./views/RenameView');
var WaitService_1 = require('./WaitService');
var RenameService = (function (_super) {
    __extends(RenameService, _super);
    function RenameService(changes, navigation, commands, source, waitService) {
        var _this = this;
        _super.call(this);
        this._changes = changes;
        this._commands = commands;
        this._navigation = navigation;
        this._source = source;
        this._waitService = waitService;
        this._disposable.add(this._commands.add(Services.AtomCommands.CommandType.TextEditor, 'rename', function () {
            _this.open();
        }));
    }
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
            var view = new RenameView_1.RenameView(this._commands, {
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
        decorators_1.alias(Services.IRenameService), 
        __metadata('design:paramtypes', [AtomChanges_1.AtomChanges, AtomNavigation_1.AtomNavigation, AtomCommands_1.AtomCommands, AtomTextEditorSource_1.AtomTextEditorSource, WaitService_1.WaitService])
    ], RenameService);
    return RenameService;
}(_ProviderServiceBase_1.ProviderServiceBase));
exports.RenameService = RenameService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVuYW1lU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hdG9tL1JlbmFtZVNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7R0FJRztBQUNILElBQVksQ0FBQyxXQUFNLFFBQVEsQ0FBQyxDQUFBO0FBQzVCLHFCQUEyQixNQUFNLENBQUMsQ0FBQTtBQUNsQyxJQUFZLFFBQVEsV0FBTSx1QkFBdUIsQ0FBQyxDQUFBO0FBQ2xELDJCQUFrQyxrQ0FBa0MsQ0FBQyxDQUFBO0FBQ3JFLHFDQUFvQyx3QkFBd0IsQ0FBQyxDQUFBO0FBQzdELDRCQUE0QixlQUFlLENBQUMsQ0FBQTtBQUM1Qyw2QkFBNkIsZ0JBQWdCLENBQUMsQ0FBQTtBQUM5QywrQkFBK0Isa0JBQWtCLENBQUMsQ0FBQTtBQUNsRCxxQ0FBcUMsd0JBQXdCLENBQUMsQ0FBQTtBQUM5RCwyQkFBMkIsb0JBQW9CLENBQUMsQ0FBQTtBQUNoRCw0QkFBNEIsZUFBZSxDQUFDLENBQUE7QUFJNUM7SUFDWSxpQ0FBbUs7SUFRM0ssdUJBQVksT0FBb0IsRUFBRSxVQUEwQixFQUFFLFFBQXNCLEVBQUUsTUFBNEIsRUFBRSxXQUF3QjtRQVRoSixpQkE0REM7UUFsRE8saUJBQU8sQ0FBQztRQUNSLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO1FBRWhDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUNoQixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsUUFBUSxFQUFFO1lBQ3ZFLEtBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNoQixDQUFDLENBQUMsQ0FDTCxDQUFDO0lBQ04sQ0FBQztJQUVTLG9DQUFZLEdBQXRCLFVBQXVCLFNBQWtHO1FBQ3JILE1BQU0sQ0FBQyxVQUFDLE9BQWlDO1lBQ3JDLE1BQU0sQ0FBQyxpQkFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUM3QyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztpQkFDcEIsTUFBTSxDQUNQLFVBQUMsR0FBRyxFQUFFLE9BQU87Z0JBQ1QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDL0IsQ0FBQyxFQUNELEVBQUUsQ0FBQyxDQUFDO1FBQ1osQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUVNLDRCQUFJLEdBQVg7UUFBQSxpQkF1QkM7UUF0QkcsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztRQUM3QyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ1QsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDdkMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzlCLElBQU0sSUFBSSxHQUFHLElBQUksdUJBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUN4QyxVQUFJO2dCQUNKLE1BQU0sRUFBRSxNQUFNO2dCQUNkLFFBQVEsRUFBRSxNQUFPLENBQUMsdUJBQXVCLEVBQUU7YUFDOUMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLE9BQU87aUJBQ1AsSUFBSSxDQUFDLENBQUMsQ0FBQztpQkFDUCxTQUFTLENBQUMsVUFBQSxPQUFPO2dCQUNkLElBQU0sTUFBTSxHQUFHLEtBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO3FCQUM5QixTQUFTLENBQUMsVUFBQSxPQUFPO29CQUNkLE1BQU0sQ0FBQyxLQUFJLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN4RCxDQUFDLENBQUM7cUJBQ0QsU0FBUyxFQUFFLENBQUM7Z0JBQ2pCLEtBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNwQyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ2xCLENBQUMsQ0FBQztpQkFDRCxTQUFTLEVBQUUsQ0FBQztRQUNyQixDQUFDO0lBQ0wsQ0FBQztJQTdETDtRQUFDLHVCQUFVO1FBQ1Ysa0JBQUssQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDOztxQkFBQTtJQTZEL0Isb0JBQUM7QUFBRCxDQUFDLEFBNURELENBQ1ksMENBQW1CLEdBMkQ5QjtBQTVEWSxxQkFBYSxnQkE0RHpCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogIEBsaWNlbnNlICAgTUlUXHJcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0ICogYXMgU2VydmljZXMgZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzJztcclxuaW1wb3J0IHsgYWxpYXMsIGluamVjdGFibGUgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvZGVjb3JhdG9ycyc7XHJcbmltcG9ydCB7IFByb3ZpZGVyU2VydmljZUJhc2UgfSBmcm9tICcuL19Qcm92aWRlclNlcnZpY2VCYXNlJztcclxuaW1wb3J0IHsgQXRvbUNoYW5nZXMgfSBmcm9tICcuL0F0b21DaGFuZ2VzJztcclxuaW1wb3J0IHsgQXRvbUNvbW1hbmRzIH0gZnJvbSAnLi9BdG9tQ29tbWFuZHMnO1xyXG5pbXBvcnQgeyBBdG9tTmF2aWdhdGlvbiB9IGZyb20gJy4vQXRvbU5hdmlnYXRpb24nO1xyXG5pbXBvcnQgeyBBdG9tVGV4dEVkaXRvclNvdXJjZSB9IGZyb20gJy4vQXRvbVRleHRFZGl0b3JTb3VyY2UnO1xyXG5pbXBvcnQgeyBSZW5hbWVWaWV3IH0gZnJvbSAnLi92aWV3cy9SZW5hbWVWaWV3JztcclxuaW1wb3J0IHsgV2FpdFNlcnZpY2UgfSBmcm9tICcuL1dhaXRTZXJ2aWNlJztcclxuXHJcbkBpbmplY3RhYmxlXHJcbkBhbGlhcyhTZXJ2aWNlcy5JUmVuYW1lU2VydmljZSlcclxuZXhwb3J0IGNsYXNzIFJlbmFtZVNlcnZpY2VcclxuICAgIGV4dGVuZHMgUHJvdmlkZXJTZXJ2aWNlQmFzZTxTZXJ2aWNlcy5JUmVuYW1lUHJvdmlkZXIsIFNlcnZpY2VzLlJlbmFtZS5JUmVxdWVzdCwgT2JzZXJ2YWJsZTxTZXJ2aWNlcy5UZXh0LklXb3Jrc3BhY2VDaGFuZ2VbXT4sIE9ic2VydmFibGU8U2VydmljZXMuVGV4dC5JV29ya3NwYWNlQ2hhbmdlW10+PlxyXG4gICAgaW1wbGVtZW50cyBTZXJ2aWNlcy5JUmVuYW1lU2VydmljZSB7XHJcbiAgICBwcml2YXRlIF9uYXZpZ2F0aW9uOiBBdG9tTmF2aWdhdGlvbjtcclxuICAgIHByaXZhdGUgX2NvbW1hbmRzOiBBdG9tQ29tbWFuZHM7XHJcbiAgICBwcml2YXRlIF9jaGFuZ2VzOiBBdG9tQ2hhbmdlcztcclxuICAgIHByaXZhdGUgX3NvdXJjZTogQXRvbVRleHRFZGl0b3JTb3VyY2U7XHJcbiAgICBwcml2YXRlIF93YWl0U2VydmljZTogV2FpdFNlcnZpY2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY2hhbmdlczogQXRvbUNoYW5nZXMsIG5hdmlnYXRpb246IEF0b21OYXZpZ2F0aW9uLCBjb21tYW5kczogQXRvbUNvbW1hbmRzLCBzb3VyY2U6IEF0b21UZXh0RWRpdG9yU291cmNlLCB3YWl0U2VydmljZTogV2FpdFNlcnZpY2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2NoYW5nZXMgPSBjaGFuZ2VzO1xyXG4gICAgICAgIHRoaXMuX2NvbW1hbmRzID0gY29tbWFuZHM7XHJcbiAgICAgICAgdGhpcy5fbmF2aWdhdGlvbiA9IG5hdmlnYXRpb247XHJcbiAgICAgICAgdGhpcy5fc291cmNlID0gc291cmNlO1xyXG4gICAgICAgIHRoaXMuX3dhaXRTZXJ2aWNlID0gd2FpdFNlcnZpY2U7XHJcblxyXG4gICAgICAgIHRoaXMuX2Rpc3Bvc2FibGUuYWRkKFxyXG4gICAgICAgICAgICB0aGlzLl9jb21tYW5kcy5hZGQoU2VydmljZXMuQXRvbUNvbW1hbmRzLkNvbW1hbmRUeXBlLlRleHRFZGl0b3IsICdyZW5hbWUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW4oKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjcmVhdGVJbnZva2UoY2FsbGJhY2tzOiAoKG9wdGlvbnM6IFNlcnZpY2VzLlJlbmFtZS5JUmVxdWVzdCkgPT4gT2JzZXJ2YWJsZTxTZXJ2aWNlcy5UZXh0LklXb3Jrc3BhY2VDaGFuZ2VbXT4pW10pIHtcclxuICAgICAgICByZXR1cm4gKG9wdGlvbnM6IFNlcnZpY2VzLlJlbmFtZS5JUmVxdWVzdCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5mcm9tKF8ub3ZlcihjYWxsYmFja3MpKG9wdGlvbnMpKVxyXG4gICAgICAgICAgICAgICAgLm1lcmdlTWFwKF8uaWRlbnRpdHkpXHJcbiAgICAgICAgICAgICAgICAucmVkdWNlKFxyXG4gICAgICAgICAgICAgICAgKGFjYywgcmVzdWx0cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhY2MuY29uY2F0KHJlc3VsdHMpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFtdKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvcGVuKCkge1xyXG4gICAgICAgIGNvbnN0IGVkaXRvciA9IHRoaXMuX3NvdXJjZS5hY3RpdmVUZXh0RWRpdG9yO1xyXG4gICAgICAgIGlmIChlZGl0b3IpIHtcclxuICAgICAgICAgICAgbGV0IHdvcmQgPSBlZGl0b3IuZ2V0V29yZFVuZGVyQ3Vyc29yKCk7XHJcbiAgICAgICAgICAgIHdvcmQgPSBfLnRyaW0od29yZCwgJygpW117fScpO1xyXG4gICAgICAgICAgICBjb25zdCB2aWV3ID0gbmV3IFJlbmFtZVZpZXcodGhpcy5fY29tbWFuZHMsIHtcclxuICAgICAgICAgICAgICAgIHdvcmQsXHJcbiAgICAgICAgICAgICAgICBlZGl0b3I6IGVkaXRvcixcclxuICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBlZGl0b3IhLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHZpZXcucmVuYW1lJFxyXG4gICAgICAgICAgICAgICAgLnRha2UoMSlcclxuICAgICAgICAgICAgICAgIC5jb25jYXRNYXAob3B0aW9ucyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5pbnZva2Uob3B0aW9ucylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNvbmNhdE1hcChjaGFuZ2VzID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGFuZ2VzLmFwcGx5V29ya3NwYWNlQ2hhbmdlcyhjaGFuZ2VzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRvUHJvbWlzZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3dhaXRTZXJ2aWNlLndhaXRVbnRpbChyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRvUHJvbWlzZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=