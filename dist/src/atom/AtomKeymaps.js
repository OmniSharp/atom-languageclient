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
var PrefixAtomKeymaps = (function (_super) {
    __extends(PrefixAtomKeymaps, _super);
    function PrefixAtomKeymaps(prefix) {
        _super.call(this);
        this._prefix = prefix;
    }
    PrefixAtomKeymaps.prototype.add = function (target, commandsOrPlatformOrKeystrokes, commandsOrKeystrokes, command) {
        var _this = this;
        var keystrokes;
        var platform = atom_languageservices_1.KeymapPlatform.All;
        var commands;
        var keymap;
        var cd = new ts_disposables_1.CompositeDisposable();
        this._disposable.add(cd);
        cd.add(function () { return _this._disposable.remove(cd); });
        var resolvedTarget = this._getSelectorType(target, platform);
        if (typeof commandsOrPlatformOrKeystrokes === 'string') {
            keystrokes = commandsOrPlatformOrKeystrokes;
        }
        else if (typeof commandsOrPlatformOrKeystrokes === 'number') {
            platform = commandsOrPlatformOrKeystrokes;
        }
        else {
            commands = commandsOrPlatformOrKeystrokes;
        }
        if (commandsOrKeystrokes) {
            if (typeof commandsOrKeystrokes === 'string') {
                keystrokes = commandsOrKeystrokes;
            }
            else {
                commands = commandsOrKeystrokes;
            }
        }
        if (keystrokes && command) {
            commands = {};
            commands[this._getKeystrokes(platform, keystrokes)] = command;
        }
        else if (!commands) {
            commands = {};
        }
        keymap = {};
        keymap[resolvedTarget] = commands;
        _.each(commands, function (cmd, stroke) {
            var keys = _this._getKeystrokes(platform, stroke);
            if (keys !== stroke) {
                delete commands[stroke];
            }
            commands[keys] = _this._getKey(cmd);
        });
        cd.add(atom.keymaps.add("" + constants_1.packageName + resolvedTarget, keymap));
        return cd;
    };
    PrefixAtomKeymaps.prototype.for = function (packageName) {
        var result = new PrefixAtomKeymaps(packageName);
        this._disposable.add(result);
        return result;
    };
    PrefixAtomKeymaps.prototype._getKey = function (key) {
        // only one : is strictly allowed
        // In this case they are binding to a specific command, not package specific.
        if (_.includes(key, ':')) {
            return key;
        }
        return constants_1.packageName + ":" + key;
    };
    PrefixAtomKeymaps.prototype._getKeystrokes = function (platform, keystrokes) {
        if (process.platform === 'darwin' && platform === atom_languageservices_1.KeymapPlatform.CtrlOrCmd) {
            return keystrokes.replace(/ctrl/g, 'cmd');
        }
        return keystrokes;
    };
    PrefixAtomKeymaps.prototype._getPlatformKey = function (platform, selector) {
        switch (platform) {
            case atom_languageservices_1.KeymapPlatform.Linux:
                return ".platform-linux " + selector;
            case atom_languageservices_1.KeymapPlatform.Windows:
                return ".platform-win32 " + selector;
            case atom_languageservices_1.KeymapPlatform.Osx:
                return ".platform-darwin " + selector;
            default:
                return selector;
        }
    };
    PrefixAtomKeymaps.prototype._getCommandKey = function (keymap) {
        switch (keymap) {
            case atom_languageservices_1.KeymapType.Autocomplete:
                return ".autocomplete-active." + constants_1.packageName;
            case atom_languageservices_1.KeymapType.TextEditor:
                return "atom-text-editor:not([mini])." + constants_1.packageName;
            case atom_languageservices_1.KeymapType.Workspace:
            default:
                return "atom-workspace";
        }
    };
    PrefixAtomKeymaps.prototype._getSelectorType = function (keymap, platform) {
        if (typeof keymap === 'string') {
            if (platform === atom_languageservices_1.KeymapPlatform.All || platform === atom_languageservices_1.KeymapPlatform.CtrlOrCmd) {
                return keymap;
            }
            return this._getPlatformKey(platform, keymap);
        }
        else {
            var cmd = this._getCommandKey(keymap);
            if (platform === atom_languageservices_1.KeymapPlatform.All || platform === atom_languageservices_1.KeymapPlatform.CtrlOrCmd) {
                return cmd;
            }
            return this._getPlatformKey(platform, cmd);
        }
    };
    PrefixAtomKeymaps = __decorate([
        decorators_1.injectable,
        decorators_1.alias(atom_languageservices_1.IAtomKeymaps), 
        __metadata('design:paramtypes', [String])
    ], PrefixAtomKeymaps);
    return PrefixAtomKeymaps;
}(ts_disposables_1.DisposableBase));
exports.PrefixAtomKeymaps = PrefixAtomKeymaps;
var AtomKeymaps = (function (_super) {
    __extends(AtomKeymaps, _super);
    function AtomKeymaps() {
        _super.call(this, constants_1.packageName);
    }
    AtomKeymaps = __decorate([
        decorators_1.injectable,
        decorators_1.alias(atom_languageservices_1.IAtomKeymaps), 
        __metadata('design:paramtypes', [])
    ], AtomKeymaps);
    return AtomKeymaps;
}(PrefixAtomKeymaps));
exports.AtomKeymaps = AtomKeymaps;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXRvbUtleW1hcHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXRvbS9BdG9tS2V5bWFwcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztHQUlHO0FBQ0gsSUFBWSxDQUFDLFdBQU0sUUFBUSxDQUFDLENBQUE7QUFDNUIsc0NBQXlELHVCQUF1QixDQUFDLENBQUE7QUFDakYsMkJBQWtDLGtDQUFrQyxDQUFDLENBQUE7QUFDckUsK0JBQWlFLGdCQUFnQixDQUFDLENBQUE7QUFDbEYsMEJBQTRCLGNBQWMsQ0FBQyxDQUFBO0FBSTNDO0lBQXVDLHFDQUFjO0lBRWpELDJCQUFZLE1BQWM7UUFDdEIsaUJBQU8sQ0FBQztRQUNSLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0lBQzFCLENBQUM7SUFNTSwrQkFBRyxHQUFWLFVBQ0ksTUFBNkIsRUFDN0IsOEJBQW1GLEVBQ25GLG9CQUF5RCxFQUN6RCxPQUFnQjtRQUpwQixpQkFxREM7UUEvQ0csSUFBSSxVQUE4QixDQUFDO1FBQ25DLElBQUksUUFBUSxHQUFHLHNDQUFjLENBQUMsR0FBRyxDQUFDO1FBQ2xDLElBQUksUUFBK0MsQ0FBQztRQUNwRCxJQUFJLE1BQTJCLENBQUM7UUFFaEMsSUFBTSxFQUFFLEdBQUcsSUFBSSxvQ0FBbUIsRUFBRSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pCLEVBQUUsQ0FBQyxHQUFHLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUEzQixDQUEyQixDQUFDLENBQUM7UUFFMUMsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUUvRCxFQUFFLENBQUMsQ0FBQyxPQUFPLDhCQUE4QixLQUFLLFFBQVEsQ0FBQyxDQUFD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QyxJQUFJLENBQUMsQ0FBQztZQUNKLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDeEMsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLHNDQUFjLENBQUMsR0FBRyxJQUFJLFFBQVEsS0FBSyxzQ0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNFLE1BQU0sQ0FBQyxHQUFHLENBQUM7WUFDZixDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQy9DLENBQUM7SUFDTCxDQUFDO0lBaElMO1FBQUMsdUJBQVU7UUFDVixrQkFBSyxDQUFDLG9DQUFZLENBQUM7O3lCQUFBO0lBZ0lwQix3QkFBQztBQUFELENBQUMsQUEvSEQsQ0FBdUMsK0JBQWMsR0ErSHBEO0FBL0hZLHlCQUFpQixvQkErSDdCLENBQUE7QUFJRDtJQUFpQywrQkFBaUI7SUFDOUM7UUFDSSxrQkFBTSx1QkFBVyxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUxMO1FBQUMsdUJBQVU7UUFDVixrQkFBSyxDQUFDLG9DQUFZLENBQUM7O21CQUFBO0lBS3BCLGtCQUFDO0FBQUQsQ0FBQyxBQUpELENBQWlDLGlCQUFpQixHQUlqRDtBQUpZLG1CQUFXLGNBSXZCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogIEBsaWNlbnNlICAgTUlUXHJcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IElBdG9tS2V5bWFwcywgS2V5bWFwUGxhdGZvcm0sIEtleW1hcFR5cGUgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMnO1xyXG5pbXBvcnQgeyBhbGlhcywgaW5qZWN0YWJsZSB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9kZWNvcmF0b3JzJztcclxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZUJhc2UsIElEaXNwb3NhYmxlIH0gZnJvbSAndHMtZGlzcG9zYWJsZXMnO1xyXG5pbXBvcnQgeyBwYWNrYWdlTmFtZSB9IGZyb20gJy4uL2NvbnN0YW50cyc7XHJcblxyXG5AaW5qZWN0YWJsZVxyXG5AYWxpYXMoSUF0b21LZXltYXBzKVxyXG5leHBvcnQgY2xhc3MgUHJlZml4QXRvbUtleW1hcHMgZXh0ZW5kcyBEaXNwb3NhYmxlQmFzZSBpbXBsZW1lbnRzIElBdG9tS2V5bWFwcyB7XHJcbiAgICBwcml2YXRlIF9wcmVmaXg6IHN0cmluZztcclxuICAgIGNvbnN0cnVjdG9yKHByZWZpeDogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9wcmVmaXggPSBwcmVmaXg7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZCh0YXJnZXQ6IChzdHJpbmcgfCBLZXltYXBUeXBlKSwgY29tbWFuZHM6IElBdG9tS2V5bWFwcy5LZXltYXBPYmplY3QpOiBJRGlzcG9zYWJsZTtcclxuICAgIHB1YmxpYyBhZGQodGFyZ2V0OiAoc3RyaW5nIHwgS2V5bWFwVHlwZSksIHBsYXRmb3JtOiBLZXltYXBQbGF0Zm9ybSwgY29tbWFuZHM6IElBdG9tS2V5bWFwcy5LZXltYXBPYmplY3QpOiBJRGlzcG9zYWJsZTtcclxuICAgIHB1YmxpYyBhZGQodGFyZ2V0OiAoc3RyaW5nIHwgS2V5bWFwVHlwZSksIGtleXN0cm9rZXM6IHN0cmluZywgY29tbWFuZDogc3RyaW5nKTogSURpc3Bvc2FibGU7XHJcbiAgICBwdWJsaWMgYWRkKHRhcmdldDogKHN0cmluZyB8IEtleW1hcFR5cGUpLCBwbGF0Zm9ybTogS2V5bWFwUGxhdGZvcm0sIGtleXN0cm9rZXM6IHN0cmluZywgY29tbWFuZDogc3RyaW5nKTogSURpc3Bvc2FibGU7XHJcbiAgICBwdWJsaWMgYWRkKFxyXG4gICAgICAgIHRhcmdldDogKHN0cmluZyB8IEtleW1hcFR5cGUpLFxyXG4gICAgICAgIGNvbW1hbmRzT3JQbGF0Zm9ybU9yS2V5c3Ryb2tlczogS2V5bWFwUGxhdGZvcm0gfCBzdHJpbmcgfCBJQXRvbUtleW1hcHMuS2V5bWFwT2JqZWN0LFxyXG4gICAgICAgIGNvbW1hbmRzT3JLZXlzdHJva2VzPzogc3RyaW5nIHwgSUF0b21LZXltYXBzLktleW1hcE9iamVjdCxcclxuICAgICAgICBjb21tYW5kPzogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIGxldCBrZXlzdHJva2VzOiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICAgICAgbGV0IHBsYXRmb3JtID0gS2V5bWFwUGxhdGZvcm0uQWxsO1xyXG4gICAgICAgIGxldCBjb21tYW5kczogSUF0b21LZXltYXBzLktleW1hcE9iamVjdCB8IHVuZGVmaW5lZDtcclxuICAgICAgICBsZXQga2V5bWFwOiBJQXRvbUtleW1hcHMuS2V5bWFwO1xyXG5cclxuICAgICAgICBjb25zdCBjZCA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XHJcbiAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQoY2QpO1xyXG4gICAgICAgIGNkLmFkZCgoKSA9PiB0aGlzLl9kaXNwb3NhYmxlLnJlbW92ZShjZCkpO1xyXG5cclxuICAgICAgICBjb25zdCByZXNvbHZlZFRhcmdldCA9IHRoaXMuX2dldFNlbGVjdG9yVHlwZSh0YXJnZXQsIHBsYXRmb3JtKTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBjb21tYW5kc09yUGxhdGZvcm1PcktleXN0cm9rZXMgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGtleXN0cm9rZXMgPSBjb21tYW5kc09yUGxhdGZvcm1PcktleXN0cm9rZXM7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY29tbWFuZHNPclBsYXRmb3JtT3JLZXlzdHJva2VzID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgICAgICBwbGF0Zm9ybSA9IGNvbW1hbmRzT3JQbGF0Zm9ybU9yS2V5c3Ryb2tlcztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb21tYW5kcyA9IGNvbW1hbmRzT3JQbGF0Zm9ybU9yS2V5c3Ryb2tlcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjb21tYW5kc09yS2V5c3Ryb2tlcykge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbW1hbmRzT3JLZXlzdHJva2VzID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAga2V5c3Ryb2tlcyA9IGNvbW1hbmRzT3JLZXlzdHJva2VzO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZHMgPSBjb21tYW5kc09yS2V5c3Ryb2tlcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGtleXN0cm9rZXMgJiYgY29tbWFuZCkge1xyXG4gICAgICAgICAgICBjb21tYW5kcyA9IHt9O1xyXG4gICAgICAgICAgICBjb21tYW5kc1t0aGlzLl9nZXRLZXlzdHJva2VzKHBsYXRmb3JtLCBrZXlzdHJva2VzKV0gPSBjb21tYW5kO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIWNvbW1hbmRzKSB7XHJcbiAgICAgICAgICAgIGNvbW1hbmRzID0ge307XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBrZXltYXAgPSB7fTtcclxuICAgICAgICBrZXltYXBbcmVzb2x2ZWRUYXJnZXRdID0gY29tbWFuZHM7XHJcblxyXG4gICAgICAgIF8uZWFjaChjb21tYW5kcywgKGNtZCwgc3Ryb2tlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGtleXMgPSB0aGlzLl9nZXRLZXlzdHJva2VzKHBsYXRmb3JtLCBzdHJva2UpO1xyXG4gICAgICAgICAgICBpZiAoa2V5cyAhPT0gc3Ryb2tlKSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgY29tbWFuZHMhW3N0cm9rZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29tbWFuZHMhW2tleXNdID0gdGhpcy5fZ2V0S2V5KGNtZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNkLmFkZChhdG9tLmtleW1hcHMuYWRkKGAke3BhY2thZ2VOYW1lfSR7cmVzb2x2ZWRUYXJnZXR9YCwga2V5bWFwKSk7XHJcbiAgICAgICAgcmV0dXJuIGNkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmb3IocGFja2FnZU5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBQcmVmaXhBdG9tS2V5bWFwcyhwYWNrYWdlTmFtZSk7XHJcbiAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQocmVzdWx0KTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2dldEtleShrZXk6IHN0cmluZykge1xyXG4gICAgICAgIC8vIG9ubHkgb25lIDogaXMgc3RyaWN0bHkgYWxsb3dlZFxyXG4gICAgICAgIC8vIEluIHRoaXMgY2FzZSB0aGV5IGFyZSBiaW5kaW5nIHRvIGEgc3BlY2lmaWMgY29tbWFuZCwgbm90IHBhY2thZ2Ugc3BlY2lmaWMuXHJcbiAgICAgICAgaWYgKF8uaW5jbHVkZXMoa2V5LCAnOicpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBrZXk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBgJHtwYWNrYWdlTmFtZX06JHtrZXl9YDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9nZXRLZXlzdHJva2VzKHBsYXRmb3JtOiBLZXltYXBQbGF0Zm9ybSwga2V5c3Ryb2tlczogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICdkYXJ3aW4nICYmIHBsYXRmb3JtID09PSBLZXltYXBQbGF0Zm9ybS5DdHJsT3JDbWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGtleXN0cm9rZXMucmVwbGFjZSgvY3RybC9nLCAnY21kJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBrZXlzdHJva2VzO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2dldFBsYXRmb3JtS2V5KHBsYXRmb3JtOiBLZXltYXBQbGF0Zm9ybSwgc2VsZWN0b3I6IHN0cmluZykge1xyXG4gICAgICAgIHN3aXRjaCAocGxhdGZvcm0pIHtcclxuICAgICAgICAgICAgY2FzZSBLZXltYXBQbGF0Zm9ybS5MaW51eDpcclxuICAgICAgICAgICAgICAgIHJldHVybiBgLnBsYXRmb3JtLWxpbnV4ICR7c2VsZWN0b3J9YDtcclxuICAgICAgICAgICAgY2FzZSBLZXltYXBQbGF0Zm9ybS5XaW5kb3dzOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGAucGxhdGZvcm0td2luMzIgJHtzZWxlY3Rvcn1gO1xyXG4gICAgICAgICAgICBjYXNlIEtleW1hcFBsYXRmb3JtLk9zeDpcclxuICAgICAgICAgICAgICAgIHJldHVybiBgLnBsYXRmb3JtLWRhcndpbiAke3NlbGVjdG9yfWA7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZWN0b3I7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2dldENvbW1hbmRLZXkoa2V5bWFwOiBLZXltYXBUeXBlKSB7XHJcbiAgICAgICAgc3dpdGNoIChrZXltYXApIHtcclxuICAgICAgICAgICAgY2FzZSBLZXltYXBUeXBlLkF1dG9jb21wbGV0ZTpcclxuICAgICAgICAgICAgICAgIHJldHVybiBgLmF1dG9jb21wbGV0ZS1hY3RpdmUuJHtwYWNrYWdlTmFtZX1gO1xyXG4gICAgICAgICAgICBjYXNlIEtleW1hcFR5cGUuVGV4dEVkaXRvcjpcclxuICAgICAgICAgICAgICAgIHJldHVybiBgYXRvbS10ZXh0LWVkaXRvcjpub3QoW21pbmldKS4ke3BhY2thZ2VOYW1lfWA7XHJcbiAgICAgICAgICAgIGNhc2UgS2V5bWFwVHlwZS5Xb3Jrc3BhY2U6XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYGF0b20td29ya3NwYWNlYDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZ2V0U2VsZWN0b3JUeXBlKGtleW1hcDogc3RyaW5nIHwgS2V5bWFwVHlwZSwgcGxhdGZvcm06IEtleW1hcFBsYXRmb3JtKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBrZXltYXAgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGlmIChwbGF0Zm9ybSA9PT0gS2V5bWFwUGxhdGZvcm0uQWxsIHx8IHBsYXRmb3JtID09PSBLZXltYXBQbGF0Zm9ybS5DdHJsT3JDbWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBrZXltYXA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dldFBsYXRmb3JtS2V5KHBsYXRmb3JtLCBrZXltYXApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNtZCA9IHRoaXMuX2dldENvbW1hbmRLZXkoa2V5bWFwKTtcclxuICAgICAgICAgICAgaWYgKHBsYXRmb3JtID09PSBLZXltYXBQbGF0Zm9ybS5BbGwgfHwgcGxhdGZvcm0gPT09IEtleW1hcFBsYXRmb3JtLkN0cmxPckNtZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNtZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2V0UGxhdGZvcm1LZXkocGxhdGZvcm0sIGNtZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5AaW5qZWN0YWJsZVxyXG5AYWxpYXMoSUF0b21LZXltYXBzKVxyXG5leHBvcnQgY2xhc3MgQXRvbUtleW1hcHMgZXh0ZW5kcyBQcmVmaXhBdG9tS2V5bWFwcyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcihwYWNrYWdlTmFtZSk7XHJcbiAgICB9XHJcbn1cclxuIl19