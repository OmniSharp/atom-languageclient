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
var PrefixAtomCommands = (function (_super) {
    __extends(PrefixAtomCommands, _super);
    function PrefixAtomCommands(prefix) {
        _super.call(this);
        this._prefix = prefix;
    }
    PrefixAtomCommands.prototype.add = function (target, commandsOrName, callback) {
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
    PrefixAtomCommands.prototype.for = function (packageName) {
        var result = new PrefixAtomCommands(packageName);
        this._disposable.add(result);
        return result;
    };
    PrefixAtomCommands.prototype._getKey = function (key) {
        // only one : is strictly allowed
        // In this case they are binding to a specific command, not package specific.
        if (_.includes(key, ':')) {
            return key;
        }
        return constants_1.packageName + ":" + key;
    };
    PrefixAtomCommands.prototype._getCommandType = function (command) {
        if (typeof command === 'number') {
            switch (command) {
                case atom_languageservices_1.CommandType.TextEditor:
                    return 'atom-text-editor';
                case atom_languageservices_1.CommandType.Workspace:
                default:
                    return 'atom-workspace';
            }
        }
        return command;
    };
    return PrefixAtomCommands;
}(ts_disposables_1.DisposableBase));
exports.PrefixAtomCommands = PrefixAtomCommands;
var AtomCommands = (function (_super) {
    __extends(AtomCommands, _super);
    function AtomCommands() {
        _super.call(this, constants_1.packageName);
    }
    AtomCommands = __decorate([
        decorators_1.injectable,
        decorators_1.alias(atom_languageservices_1.IAtomCommands), 
        __metadata('design:paramtypes', [])
    ], AtomCommands);
    return AtomCommands;
}(PrefixAtomCommands));
exports.AtomCommands = AtomCommands;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXRvbUNvbW1hbmRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2F0b20vQXRvbUNvbW1hbmRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCxJQUFZLENBQUMsV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUM1QixzQ0FBMkMsdUJBQXVCLENBQUMsQ0FBQTtBQUNuRSwyQkFBa0Msa0NBQWtDLENBQUMsQ0FBQTtBQUNyRSwrQkFBaUUsZ0JBQWdCLENBQUMsQ0FBQTtBQUNsRiwwQkFBNEIsY0FBYyxDQUFDLENBQUE7QUFFM0M7SUFBd0Msc0NBQWM7SUFFbEQsNEJBQVksTUFBYztRQUN0QixpQkFBTyxDQUFDO1FBQ1IsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7SUFDMUIsQ0FBQztJQUlNLGdDQUFHLEdBQVYsVUFBVyxNQUFxQyxFQUFFLGNBQW9ELEVBQUUsUUFBc0M7UUFBOUksaUJBZUM7UUFkRyxJQUFNLEVBQUUsR0FBRyxJQUFJLG9DQUFtQixFQUFFLENBQUM7UUFDckMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekIsRUFBRSxDQUFDLEdBQUcsQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQTNCLENBQTJCLENBQUMsQ0FBQztRQUUxQyxFQUFFLENBQUMsQ0FBQyxPQUFPLGNBQWMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxFQUFFLFFBQVMsQ0FBQyxDQUFDLENBQUM7UUFDckcsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBTSxRQUFNLEdBQTBCLEVBQUUsQ0FBQztZQUN6QyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxVQUFDLE1BQU0sRUFBRSxHQUFHO2dCQUMvQixRQUFNLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztZQUN2QyxDQUFDLENBQUMsQ0FBQztZQUNILEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsRUFBRSxRQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3BFLENBQUM7UUFDRCxNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVNLGdDQUFHLEdBQVYsVUFBVyxXQUFtQjtRQUMxQixJQUFNLE1BQU0sR0FBRyxJQUFJLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ25ELElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdCLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVPLG9DQUFPLEdBQWYsVUFBZ0IsR0FBVztRQUN2QixpQ0FBaUM7UUFDakMsNkVBQTZFO1FBQzdFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QixNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQztRQUNELE1BQU0sQ0FBSSx1QkFBVyxTQUFJLEdBQUssQ0FBQztJQUNuQyxDQUFDO0lBRU8sNENBQWUsR0FBdkIsVUFBd0IsT0FBb0M7UUFDeEQsRUFBRSxDQUFDLENBQUMsT0FBTyxPQUFPLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM5QixNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNkLEtBQUssbUNBQVcsQ0FBQyxVQUFVO29CQUN2QixNQUFNLENBQUMsa0JBQWtCLENBQUM7Z0JBQzlCLEtBQUssbUNBQVcsQ0FBQyxTQUFTLENBQUM7Z0JBQzNCO29CQUNJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztZQUNoQyxDQUFDO1FBQ0wsQ0FBQztRQUNELE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUNMLHlCQUFDO0FBQUQsQ0FBQyxBQXJERCxDQUF3QywrQkFBYyxHQXFEckQ7QUFyRFksMEJBQWtCLHFCQXFEOUIsQ0FBQTtBQUlEO0lBQWtDLGdDQUFrQjtJQUNoRDtRQUNJLGtCQUFNLHVCQUFXLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBTEw7UUFBQyx1QkFBVTtRQUNWLGtCQUFLLENBQUMscUNBQWEsQ0FBQzs7b0JBQUE7SUFLckIsbUJBQUM7QUFBRCxDQUFDLEFBSkQsQ0FBa0Msa0JBQWtCLEdBSW5EO0FBSlksb0JBQVksZUFJeEIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiAgQGxpY2Vuc2UgICBNSVRcclxuICogIEBjb3B5cmlnaHQgT21uaVNoYXJwIFRlYW1cclxuICogIEBzdW1tYXJ5ICAgQWRkcyBzdXBwb3J0IGZvciBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L2xhbmd1YWdlLXNlcnZlci1wcm90b2NvbCAoYW5kIG1vcmUhKSB0byBodHRwczovL2F0b20uaW9cclxuICovXHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgQ29tbWFuZFR5cGUsIElBdG9tQ29tbWFuZHMgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMnO1xyXG5pbXBvcnQgeyBhbGlhcywgaW5qZWN0YWJsZSB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9kZWNvcmF0b3JzJztcclxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZUJhc2UsIElEaXNwb3NhYmxlIH0gZnJvbSAndHMtZGlzcG9zYWJsZXMnO1xyXG5pbXBvcnQgeyBwYWNrYWdlTmFtZSB9IGZyb20gJy4uL2NvbnN0YW50cyc7XHJcblxyXG5leHBvcnQgY2xhc3MgUHJlZml4QXRvbUNvbW1hbmRzIGV4dGVuZHMgRGlzcG9zYWJsZUJhc2UgaW1wbGVtZW50cyBJQXRvbUNvbW1hbmRzIHtcclxuICAgIHByaXZhdGUgX3ByZWZpeDogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IocHJlZml4OiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX3ByZWZpeCA9IHByZWZpeDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkKHRhcmdldDogKHN0cmluZyB8IENvbW1hbmRUeXBlIHwgTm9kZSksIGNvbW1hbmRzOiBJQXRvbUNvbW1hbmRzLkNvbW1hbmRPYmplY3QpOiBJRGlzcG9zYWJsZTtcclxuICAgIHB1YmxpYyBhZGQodGFyZ2V0OiAoc3RyaW5nIHwgQ29tbWFuZFR5cGUgfCBOb2RlKSwgY29tbWFuZE5hbWU6IHN0cmluZywgY2FsbGJhY2s6IElBdG9tQ29tbWFuZHMuRXZlbnRDYWxsYmFjayk6IElEaXNwb3NhYmxlO1xyXG4gICAgcHVibGljIGFkZCh0YXJnZXQ6IChzdHJpbmcgfCBDb21tYW5kVHlwZSB8IE5vZGUpLCBjb21tYW5kc09yTmFtZTogc3RyaW5nIHwgSUF0b21Db21tYW5kcy5Db21tYW5kT2JqZWN0LCBjYWxsYmFjaz86IElBdG9tQ29tbWFuZHMuRXZlbnRDYWxsYmFjaykge1xyXG4gICAgICAgIGNvbnN0IGNkID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcclxuICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLmFkZChjZCk7XHJcbiAgICAgICAgY2QuYWRkKCgpID0+IHRoaXMuX2Rpc3Bvc2FibGUucmVtb3ZlKGNkKSk7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgY29tbWFuZHNPck5hbWUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGNkLmFkZChhdG9tLmNvbW1hbmRzLmFkZCh0aGlzLl9nZXRDb21tYW5kVHlwZSh0YXJnZXQpLCB0aGlzLl9nZXRLZXkoY29tbWFuZHNPck5hbWUpLCBjYWxsYmFjayEpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQ6IHR5cGVvZiBjb21tYW5kc09yTmFtZSA9IHt9O1xyXG4gICAgICAgICAgICBfLmVhY2goY29tbWFuZHNPck5hbWUsIChtZXRob2QsIGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0W3RoaXMuX2dldEtleShrZXkpXSA9IG1ldGhvZDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNkLmFkZChhdG9tLmNvbW1hbmRzLmFkZCh0aGlzLl9nZXRDb21tYW5kVHlwZSh0YXJnZXQpLCByZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmb3IocGFja2FnZU5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBQcmVmaXhBdG9tQ29tbWFuZHMocGFja2FnZU5hbWUpO1xyXG4gICAgICAgIHRoaXMuX2Rpc3Bvc2FibGUuYWRkKHJlc3VsdCk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9nZXRLZXkoa2V5OiBzdHJpbmcpIHtcclxuICAgICAgICAvLyBvbmx5IG9uZSA6IGlzIHN0cmljdGx5IGFsbG93ZWRcclxuICAgICAgICAvLyBJbiB0aGlzIGNhc2UgdGhleSBhcmUgYmluZGluZyB0byBhIHNwZWNpZmljIGNvbW1hbmQsIG5vdCBwYWNrYWdlIHNwZWNpZmljLlxyXG4gICAgICAgIGlmIChfLmluY2x1ZGVzKGtleSwgJzonKSkge1xyXG4gICAgICAgICAgICByZXR1cm4ga2V5O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYCR7cGFja2FnZU5hbWV9OiR7a2V5fWA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZ2V0Q29tbWFuZFR5cGUoY29tbWFuZDogc3RyaW5nIHwgQ29tbWFuZFR5cGUgfCBOb2RlKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjb21tYW5kID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGNvbW1hbmQpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgQ29tbWFuZFR5cGUuVGV4dEVkaXRvcjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2F0b20tdGV4dC1lZGl0b3InO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBDb21tYW5kVHlwZS5Xb3Jrc3BhY2U6XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnYXRvbS13b3Jrc3BhY2UnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb21tYW5kO1xyXG4gICAgfVxyXG59XHJcblxyXG5AaW5qZWN0YWJsZVxyXG5AYWxpYXMoSUF0b21Db21tYW5kcylcclxuZXhwb3J0IGNsYXNzIEF0b21Db21tYW5kcyBleHRlbmRzIFByZWZpeEF0b21Db21tYW5kcyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcihwYWNrYWdlTmFtZSk7XHJcbiAgICB9XHJcbn1cclxuIl19