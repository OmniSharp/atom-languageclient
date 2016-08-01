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
var atom_languageservices_1 = require('atom-languageservices');
var decorators_1 = require('atom-languageservices/decorators');
var ts_disposables_1 = require('ts-disposables');
var constants_1 = require('../constants');
var AtomCommands = (function (_super) {
    __extends(AtomCommands, _super);
    function AtomCommands() {
        _super.call(this);
    }
    AtomCommands.prototype.add = function (target, commandsOrName, callback) {
        var _this = this;
        var cd = new ts_disposables_1.CompositeDisposable();
        this._disposable.add(cd);
        cd.add(function () { return _this._disposable.remove(cd); });
        if (typeof commandsOrName === 'string') {
            cd.add(atom.commands.add(this._getCommandType(target), this._getKey(commandsOrName), callback));
        }
        else {
            var result_1 = {};
            _.each(commandsOrName, function (method, key) {
                result_1[_this._getKey(key)] = method;
            });
            cd.add(atom.commands.add(this._getCommandType(target), result_1));
        }
        return cd;
    };
    AtomCommands.prototype._getKey = function (key) {
        // only one : is strictly allowed
        // In this case they are binding to a specific command, not package specific.
        if (_.includes(key, ':')) {
            return key;
        }
        return constants_1.packageName + ":" + key;
    };
    AtomCommands.prototype._getCommandType = function (command) {
        if (typeof command === 'number') {
            switch (command) {
                case atom_languageservices_1.AtomCommands.CommandType.TextEditor:
                    return 'atom-text-editor';
                case atom_languageservices_1.AtomCommands.CommandType.Workspace:
                default:
                    return 'atom-workspace';
            }
        }
        return command;
    };
    AtomCommands = __decorate([
        decorators_1.injectable,
        decorators_1.alias(atom_languageservices_1.IAtomCommands), 
        __metadata('design:paramtypes', [])
    ], AtomCommands);
    return AtomCommands;
}(ts_disposables_1.DisposableBase));
exports.AtomCommands = AtomCommands;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXRvbUNvbW1hbmRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2F0b20vQXRvbUNvbW1hbmRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCxJQUFZLENBQUMsV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUM1QixzQ0FBNkQsdUJBQXVCLENBQUMsQ0FBQTtBQUNyRiwyQkFBa0Msa0NBQWtDLENBQUMsQ0FBQTtBQUNyRSwrQkFBaUUsZ0JBQWdCLENBQUMsQ0FBQTtBQUNsRiwwQkFBNEIsY0FBYyxDQUFDLENBQUE7QUFPM0M7SUFBa0MsZ0NBQWM7SUFDNUM7UUFDSSxpQkFBTyxDQUFDO0lBQ1osQ0FBQztJQUlNLDBCQUFHLEdBQVYsVUFBVyxNQUFxQyxFQUFFLGNBQXNDLEVBQUUsUUFBd0I7UUFBbEgsaUJBZUM7UUFkRyxJQUFNLEVBQUUsR0FBRyxJQUFJLG9DQUFtQixFQUFFLENBQUM7UUFDckMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekIsRUFBRSxDQUFDLEdBQUcsQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQTNCLENBQTJCLENBQUMsQ0FBQztRQUUxQyxFQUFFLENBQUMsQ0FBQyxPQUFPLGNBQWMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxFQUFFLFFBQVMsQ0FBQyxDQUFDLENBQUM7UUFDckcsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBTSxRQUFNLEdBQTBCLEVBQUUsQ0FBQztZQUN6QyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxVQUFDLE1BQU0sRUFBRSxHQUFHO2dCQUMvQixRQUFNLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztZQUN2QyxDQUFDLENBQUMsQ0FBQztZQUNILEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsRUFBRSxRQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3BFLENBQUM7UUFDRCxNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVPLDhCQUFPLEdBQWYsVUFBZ0IsR0FBVztRQUN2QixpQ0FBaUM7UUFDakMsNkVBQTZFO1FBQzdFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QixNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQztRQUNELE1BQU0sQ0FBSSx1QkFBVyxTQUFJLEdBQUssQ0FBQztJQUNuQyxDQUFDO0lBRU8sc0NBQWUsR0FBdkIsVUFBd0IsT0FBb0M7UUFDeEQsRUFBRSxDQUFDLENBQUMsT0FBTyxPQUFPLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM5QixNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNkLEtBQUssb0NBQWEsQ0FBQyxXQUFXLENBQUMsVUFBVTtvQkFDckMsTUFBTSxDQUFDLGtCQUFrQixDQUFDO2dCQUM5QixLQUFLLG9DQUFhLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQztnQkFDekM7b0JBQ0ksTUFBTSxDQUFDLGdCQUFnQixDQUFDO1lBQ2hDLENBQUM7UUFDTCxDQUFDO1FBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBOUNMO1FBQUMsdUJBQVU7UUFDVixrQkFBSyxDQUFDLHFDQUFhLENBQUM7O29CQUFBO0lBOENyQixtQkFBQztBQUFELENBQUMsQUE3Q0QsQ0FBa0MsK0JBQWMsR0E2Qy9DO0FBN0NZLG9CQUFZLGVBNkN4QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBBdG9tQ29tbWFuZHMgYXMgQVRPTV9DT01NQU5EUywgSUF0b21Db21tYW5kcyB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCB7IGFsaWFzLCBpbmplY3RhYmxlIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL2RlY29yYXRvcnMnO1xyXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlQmFzZSwgSURpc3Bvc2FibGUgfSBmcm9tICd0cy1kaXNwb3NhYmxlcyc7XHJcbmltcG9ydCB7IHBhY2thZ2VOYW1lIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcclxudHlwZSBDb21tYW5kVHlwZSA9IEFUT01fQ09NTUFORFMuQ29tbWFuZFR5cGU7XHJcbnR5cGUgQ29tbWFuZE9iamVjdCA9IEFUT01fQ09NTUFORFMuQ29tbWFuZE9iamVjdDtcclxudHlwZSBFdmVudENhbGxiYWNrID0gQVRPTV9DT01NQU5EUy5FdmVudENhbGxiYWNrO1xyXG5cclxuQGluamVjdGFibGVcclxuQGFsaWFzKElBdG9tQ29tbWFuZHMpXHJcbmV4cG9ydCBjbGFzcyBBdG9tQ29tbWFuZHMgZXh0ZW5kcyBEaXNwb3NhYmxlQmFzZSBpbXBsZW1lbnRzIElBdG9tQ29tbWFuZHMge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkKHRhcmdldDogKHN0cmluZyB8IENvbW1hbmRUeXBlIHwgTm9kZSksIGNvbW1hbmRzOiBDb21tYW5kT2JqZWN0KTogSURpc3Bvc2FibGU7XHJcbiAgICBwdWJsaWMgYWRkKHRhcmdldDogKHN0cmluZyB8IENvbW1hbmRUeXBlIHwgTm9kZSksIGNvbW1hbmROYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiBFdmVudENhbGxiYWNrKTogSURpc3Bvc2FibGU7XHJcbiAgICBwdWJsaWMgYWRkKHRhcmdldDogKHN0cmluZyB8IENvbW1hbmRUeXBlIHwgTm9kZSksIGNvbW1hbmRzT3JOYW1lOiBzdHJpbmcgfCBDb21tYW5kT2JqZWN0LCBjYWxsYmFjaz86IEV2ZW50Q2FsbGJhY2spIHtcclxuICAgICAgICBjb25zdCBjZCA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XHJcbiAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQoY2QpO1xyXG4gICAgICAgIGNkLmFkZCgoKSA9PiB0aGlzLl9kaXNwb3NhYmxlLnJlbW92ZShjZCkpO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIGNvbW1hbmRzT3JOYW1lID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBjZC5hZGQoYXRvbS5jb21tYW5kcy5hZGQodGhpcy5fZ2V0Q29tbWFuZFR5cGUodGFyZ2V0KSwgdGhpcy5fZ2V0S2V5KGNvbW1hbmRzT3JOYW1lKSwgY2FsbGJhY2shKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0OiB0eXBlb2YgY29tbWFuZHNPck5hbWUgPSB7fTtcclxuICAgICAgICAgICAgXy5lYWNoKGNvbW1hbmRzT3JOYW1lLCAobWV0aG9kLCBrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdFt0aGlzLl9nZXRLZXkoa2V5KV0gPSBtZXRob2Q7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjZC5hZGQoYXRvbS5jb21tYW5kcy5hZGQodGhpcy5fZ2V0Q29tbWFuZFR5cGUodGFyZ2V0KSwgcmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9nZXRLZXkoa2V5OiBzdHJpbmcpIHtcclxuICAgICAgICAvLyBvbmx5IG9uZSA6IGlzIHN0cmljdGx5IGFsbG93ZWRcclxuICAgICAgICAvLyBJbiB0aGlzIGNhc2UgdGhleSBhcmUgYmluZGluZyB0byBhIHNwZWNpZmljIGNvbW1hbmQsIG5vdCBwYWNrYWdlIHNwZWNpZmljLlxyXG4gICAgICAgIGlmIChfLmluY2x1ZGVzKGtleSwgJzonKSkge1xyXG4gICAgICAgICAgICByZXR1cm4ga2V5O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYCR7cGFja2FnZU5hbWV9OiR7a2V5fWA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZ2V0Q29tbWFuZFR5cGUoY29tbWFuZDogc3RyaW5nIHwgQ29tbWFuZFR5cGUgfCBOb2RlKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjb21tYW5kID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGNvbW1hbmQpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgQVRPTV9DT01NQU5EUy5Db21tYW5kVHlwZS5UZXh0RWRpdG9yOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnYXRvbS10ZXh0LWVkaXRvcic7XHJcbiAgICAgICAgICAgICAgICBjYXNlIEFUT01fQ09NTUFORFMuQ29tbWFuZFR5cGUuV29ya3NwYWNlOlxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2F0b20td29ya3NwYWNlJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29tbWFuZDtcclxuICAgIH1cclxufVxyXG4iXX0=