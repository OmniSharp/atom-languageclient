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
var atom_languageservices_1 = require('atom-languageservices');
var decorators_1 = require('atom-languageservices/decorators');
var ts_disposables_1 = require('ts-disposables');
var AtomCommands_1 = require('./AtomCommands');
var AtomKeymaps_1 = require('./AtomKeymaps');
var CommandsService = (function (_super) {
    __extends(CommandsService, _super);
    function CommandsService(atomCommands, atomKeymaps) {
        _super.call(this);
        this._atomCommands = atomCommands;
        this._atomKeymaps = atomKeymaps;
    }
    CommandsService.prototype.add = function (target, commandName, keystrokes, callback) {
        var cd = new ts_disposables_1.CompositeDisposable();
        if (typeof keystrokes === 'string') {
            keystrokes = [keystrokes];
        }
        cd.add(this._atomCommands.add(target, commandName, callback));
        for (var _i = 0, keystrokes_1 = keystrokes; _i < keystrokes_1.length; _i++) {
            var keystroke = keystrokes_1[_i];
            cd.add(this._atomKeymaps.add(this._getKeymapType(target), atom_languageservices_1.KeymapPlatform.CtrlOrCmd, keystroke, commandName));
        }
        return cd;
    };
    CommandsService.prototype._getKeymapType = function (target) {
        var name = atom_languageservices_1.CommandType[target];
        return atom_languageservices_1.KeymapType[name];
    };
    CommandsService = __decorate([
        decorators_1.injectable,
        decorators_1.alias(atom_languageservices_1.ICommandsService), 
        __metadata('design:paramtypes', [AtomCommands_1.AtomCommands, AtomKeymaps_1.AtomKeymaps])
    ], CommandsService);
    return CommandsService;
}(ts_disposables_1.DisposableBase));
exports.CommandsService = CommandsService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZHNTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2F0b20vQ29tbWFuZHNTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCxzQ0FBeUYsdUJBQXVCLENBQUMsQ0FBQTtBQUNqSCwyQkFBa0Msa0NBQWtDLENBQUMsQ0FBQTtBQUNyRSwrQkFBb0QsZ0JBQWdCLENBQUMsQ0FBQTtBQUNyRSw2QkFBNkIsZ0JBQWdCLENBQUMsQ0FBQTtBQUM5Qyw0QkFBNEIsZUFBZSxDQUFDLENBQUE7QUFJNUM7SUFBcUMsbUNBQWM7SUFHL0MseUJBQVksWUFBMEIsRUFBRSxXQUF3QjtRQUM1RCxpQkFBTyxDQUFDO1FBQ1IsSUFBSSxDQUFDLGFBQWEsR0FBRyxZQUFZLENBQUM7UUFDbEMsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7SUFDcEMsQ0FBQztJQUVNLDZCQUFHLEdBQVYsVUFBVyxNQUFtQixFQUFFLFdBQW1CLEVBQUUsVUFBNkIsRUFBRSxRQUFxQztRQUNySCxJQUFNLEVBQUUsR0FBRyxJQUFJLG9DQUFtQixFQUFFLENBQUM7UUFDckMsRUFBRSxDQUFDLENBQUMsT0FBTyxVQUFVLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNqQyxVQUFVLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBQ0QsRUFBRSxDQUFDLEdBQUcsQ0FDRixJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUN4RCxDQUFDO1FBQ0YsR0FBRyxDQUFDLENBQW9CLFVBQVUsRUFBVix5QkFBVSxFQUFWLHdCQUFVLEVBQVYsSUFBVSxDQUFDO1lBQTlCLElBQU0sU0FBUyxtQkFBQTtZQUNoQixFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsc0NBQWMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUE7U0FDL0c7UUFDRCxNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVPLHdDQUFjLEdBQXRCLFVBQXVCLE1BQW1CO1FBQ3RDLElBQU0sSUFBSSxHQUFHLG1DQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDakMsTUFBTSxDQUFNLGtDQUFVLENBQU0sSUFBSSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQTVCTDtRQUFDLHVCQUFVO1FBQ1Ysa0JBQUssQ0FBQyx3Q0FBZ0IsQ0FBQzs7dUJBQUE7SUE0QnhCLHNCQUFDO0FBQUQsQ0FBQyxBQTNCRCxDQUFxQywrQkFBYyxHQTJCbEQ7QUEzQlksdUJBQWUsa0JBMkIzQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0IHsgQ29tbWFuZFR5cGUsIElBdG9tQ29tbWFuZHMsIElDb21tYW5kc1NlcnZpY2UsIEtleW1hcFBsYXRmb3JtLCBLZXltYXBUeXBlIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzJztcclxuaW1wb3J0IHsgYWxpYXMsIGluamVjdGFibGUgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvZGVjb3JhdG9ycyc7XHJcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGVCYXNlIH0gZnJvbSAndHMtZGlzcG9zYWJsZXMnO1xyXG5pbXBvcnQgeyBBdG9tQ29tbWFuZHMgfSBmcm9tICcuL0F0b21Db21tYW5kcyc7XHJcbmltcG9ydCB7IEF0b21LZXltYXBzIH0gZnJvbSAnLi9BdG9tS2V5bWFwcyc7XHJcblxyXG5AaW5qZWN0YWJsZVxyXG5AYWxpYXMoSUNvbW1hbmRzU2VydmljZSlcclxuZXhwb3J0IGNsYXNzIENvbW1hbmRzU2VydmljZSBleHRlbmRzIERpc3Bvc2FibGVCYXNlIGltcGxlbWVudHMgSUNvbW1hbmRzU2VydmljZSB7XHJcbiAgICBwcml2YXRlIF9hdG9tQ29tbWFuZHM6IEF0b21Db21tYW5kcztcclxuICAgIHByaXZhdGUgX2F0b21LZXltYXBzOiBBdG9tS2V5bWFwcztcclxuICAgIGNvbnN0cnVjdG9yKGF0b21Db21tYW5kczogQXRvbUNvbW1hbmRzLCBhdG9tS2V5bWFwczogQXRvbUtleW1hcHMpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2F0b21Db21tYW5kcyA9IGF0b21Db21tYW5kcztcclxuICAgICAgICB0aGlzLl9hdG9tS2V5bWFwcyA9IGF0b21LZXltYXBzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGQodGFyZ2V0OiBDb21tYW5kVHlwZSwgY29tbWFuZE5hbWU6IHN0cmluZywga2V5c3Ryb2tlczogc3RyaW5nIHwgc3RyaW5nW10sIGNhbGxiYWNrOiBJQXRvbUNvbW1hbmRzLkV2ZW50Q2FsbGJhY2spIHtcclxuICAgICAgICBjb25zdCBjZCA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBrZXlzdHJva2VzID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBrZXlzdHJva2VzID0gW2tleXN0cm9rZXNdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjZC5hZGQoXHJcbiAgICAgICAgICAgIHRoaXMuX2F0b21Db21tYW5kcy5hZGQodGFyZ2V0LCBjb21tYW5kTmFtZSwgY2FsbGJhY2spXHJcbiAgICAgICAgKTtcclxuICAgICAgICBmb3IgKGNvbnN0IGtleXN0cm9rZSBvZiBrZXlzdHJva2VzKSB7XHJcbiAgICAgICAgICAgIGNkLmFkZCh0aGlzLl9hdG9tS2V5bWFwcy5hZGQodGhpcy5fZ2V0S2V5bWFwVHlwZSh0YXJnZXQpLCBLZXltYXBQbGF0Zm9ybS5DdHJsT3JDbWQsIGtleXN0cm9rZSwgY29tbWFuZE5hbWUpKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2Q7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZ2V0S2V5bWFwVHlwZSh0YXJnZXQ6IENvbW1hbmRUeXBlKTogS2V5bWFwVHlwZSB7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IENvbW1hbmRUeXBlW3RhcmdldF07XHJcbiAgICAgICAgcmV0dXJuIDxhbnk+S2V5bWFwVHlwZVs8YW55Pm5hbWVdO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==