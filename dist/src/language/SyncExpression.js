"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
var _ = require('lodash');
/* tslint:disable */
var SyncExpression = (function () {
    function SyncExpression() {
    }
    SyncExpression.create = function (options) {
        var grammarNameSelectors = null;
        var grammarScopeNameSelectors = null;
        var extensionSelectors = null;
        var textDocumentFilter = null;
        if (options.documentSelector) {
            if (_.isArray(options.documentSelector)) {
                grammarNameSelectors = options.documentSelector;
            }
            else {
                grammarNameSelectors = [options.documentSelector];
            }
        }
        if (options.synchronize) {
            var synchronize = options.synchronize;
            if (synchronize.grammarScopeSelector) {
                if (_.isArray(synchronize.grammarScopeSelector)) {
                    grammarScopeNameSelectors = synchronize.grammarScopeSelector;
                }
                else {
                    grammarScopeNameSelectors = [synchronize.grammarScopeSelector];
                }
            }
            if (synchronize.extensionSelector) {
                if (_.isArray(synchronize.extensionSelector)) {
                    extensionSelectors = synchronize.extensionSelector;
                }
                else {
                    extensionSelectors = [synchronize.extensionSelector];
                }
            }
            if (synchronize.textDocumentFilter) {
                textDocumentFilter = synchronize.textDocumentFilter;
            }
        }
        var syncExpressions = [];
        if (grammarNameSelectors) {
            syncExpressions.push.apply(syncExpressions, _.map(grammarNameSelectors, function (selector) { return new GrammarNameExpression(selector); }));
        }
        if (extensionSelectors) {
            syncExpressions.push.apply(syncExpressions, _.map(extensionSelectors, function (selector) { return new GrammarFileTypeExpression(selector); }));
        }
        if (grammarScopeNameSelectors) {
            syncExpressions.push.apply(syncExpressions, _.map(grammarScopeNameSelectors, function (selector) { return new GrammarScopeNameExpression(selector); }));
        }
        if (textDocumentFilter) {
            syncExpressions.push(new TextEditorSyncExpression(textDocumentFilter));
        }
        if (!syncExpressions.length) {
            return new FalseSyncExpression();
        }
        if (syncExpressions.length === 1) {
            return syncExpressions[0];
        }
        return new CompositeSyncExpression(syncExpressions);
    };
    return SyncExpression;
}());
exports.SyncExpression = SyncExpression;
var FalseSyncExpression = (function (_super) {
    __extends(FalseSyncExpression, _super);
    function FalseSyncExpression() {
        _super.apply(this, arguments);
    }
    FalseSyncExpression.prototype.evaluate = function (editor) {
        return false;
    };
    return FalseSyncExpression;
}(SyncExpression));
var GrammarNameExpression = (function (_super) {
    __extends(GrammarNameExpression, _super);
    function GrammarNameExpression(id) {
        _super.call(this);
        this._id = new RegExp("^" + id + "$", 'i');
    }
    GrammarNameExpression.prototype.evaluate = function (editor) {
        if (!editor) {
            return false;
        }
        var grammar = editor.getGrammar();
        return !!grammar.name.match(this._id);
    };
    return GrammarNameExpression;
}(SyncExpression));
var GrammarFileTypeExpression = (function (_super) {
    __extends(GrammarFileTypeExpression, _super);
    function GrammarFileTypeExpression(id) {
        _super.call(this);
        this._id = new RegExp("^" + _.trimStart(id, '.') + "$", 'i');
    }
    GrammarFileTypeExpression.prototype.evaluate = function (editor) {
        var _this = this;
        if (!editor) {
            return false;
        }
        var grammar = editor.getGrammar();
        return _.some(grammar.fileTypes, function (ft) { return ft.match(_this._id); });
    };
    GrammarFileTypeExpression._regexpCache = new Map();
    GrammarFileTypeExpression._filterPredicate = _.negate(_.partial(_.isEqual, 'source'));
    return GrammarFileTypeExpression;
}(SyncExpression));
var GrammarScopeNameExpression = (function (_super) {
    __extends(GrammarScopeNameExpression, _super);
    function GrammarScopeNameExpression(id) {
        _super.call(this);
        this._id = id;
    }
    GrammarScopeNameExpression.prototype.evaluate = function (editor) {
        var _this = this;
        if (!editor) {
            return false;
        }
        var grammar = editor.getGrammar();
        var regexps = GrammarScopeNameExpression._regexpCache.get(grammar.name);
        if (!regexps) {
            regexps = _(grammar.scopeName.split('.')).filter(GrammarScopeNameExpression._filterPredicate).map(function (name) { return new RegExp("^" + name + "$", 'i'); }).value();
            GrammarScopeNameExpression._regexpCache.set(grammar.name, regexps);
        }
        return _.some(regexps, function (name) { return _this._id.match(name); });
    };
    GrammarScopeNameExpression._regexpCache = new Map();
    GrammarScopeNameExpression._filterPredicate = _.negate(_.partial(_.isEqual, 'source'));
    return GrammarScopeNameExpression;
}(SyncExpression));
var TextEditorSyncExpression = (function (_super) {
    __extends(TextEditorSyncExpression, _super);
    function TextEditorSyncExpression(func) {
        _super.call(this);
        this._func = func;
    }
    TextEditorSyncExpression.prototype.evaluate = function (editor) {
        if (!editor) {
            return false;
        }
        return this._func(editor);
    };
    return TextEditorSyncExpression;
}(SyncExpression));
var CompositeSyncExpression = (function (_super) {
    __extends(CompositeSyncExpression, _super);
    function CompositeSyncExpression(values) {
        _super.call(this);
        this._expression = values;
    }
    CompositeSyncExpression.prototype.evaluate = function (editor) {
        return this._expression.some(function (exp) { return exp.evaluate(editor); });
    };
    return CompositeSyncExpression;
}(SyncExpression));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3luY0V4cHJlc3Npb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGFuZ3VhZ2UvU3luY0V4cHJlc3Npb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7R0FJRztBQUNILElBQVksQ0FBQyxXQUFNLFFBQVEsQ0FBQyxDQUFBO0FBRzVCLG9CQUFvQjtBQUNwQjtJQUFBO0lBbUVBLENBQUM7SUFsRWlCLHFCQUFNLEdBQXBCLFVBQXFCLE9BQXVDO1FBQ3hELElBQUksb0JBQW9CLEdBQW9CLElBQUksQ0FBQztRQUNqRCxJQUFJLHlCQUF5QixHQUFvQixJQUFJLENBQUM7UUFDdEQsSUFBSSxrQkFBa0IsR0FBb0IsSUFBSSxDQUFDO1FBQy9DLElBQUksa0JBQWtCLEdBQWtELElBQUksQ0FBQztRQUU3RSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQzNCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxvQkFBb0IsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUM7WUFDcEQsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLG9CQUFvQixHQUFHLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDdEQsQ0FBQztRQUNMLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUN0QixJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO1lBQ3hDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM5Qyx5QkFBeUIs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ICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudE9wdGlvbnMsIElTeW5jRXhwcmVzc2lvbiB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcblxyXG4vKiB0c2xpbnQ6ZGlzYWJsZSAqL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU3luY0V4cHJlc3Npb24gaW1wbGVtZW50cyBJU3luY0V4cHJlc3Npb24ge1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGUob3B0aW9uczogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnRPcHRpb25zKSB7XHJcbiAgICAgICAgbGV0IGdyYW1tYXJOYW1lU2VsZWN0b3JzOiBzdHJpbmdbXSB8IG51bGwgPSBudWxsO1xyXG4gICAgICAgIGxldCBncmFtbWFyU2NvcGVOYW1lU2VsZWN0b3JzOiBzdHJpbmdbXSB8IG51bGwgPSBudWxsO1xyXG4gICAgICAgIGxldCBleHRlbnNpb25TZWxlY3RvcnM6IHN0cmluZ1tdIHwgbnVsbCA9IG51bGw7XHJcbiAgICAgICAgbGV0IHRleHREb2N1bWVudEZpbHRlcjogKChlZGl0b3I6IEF0b20uVGV4dEVkaXRvcikgPT4gYm9vbGVhbikgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKG9wdGlvbnMuZG9jdW1lbnRTZWxlY3Rvcikge1xyXG4gICAgICAgICAgICBpZiAoXy5pc0FycmF5KG9wdGlvbnMuZG9jdW1lbnRTZWxlY3RvcikpIHtcclxuICAgICAgICAgICAgICAgIGdyYW1tYXJOYW1lU2VsZWN0b3JzID0gb3B0aW9ucy5kb2N1bWVudFNlbGVjdG9yO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZ3JhbW1hck5hbWVTZWxlY3RvcnMgPSBbb3B0aW9ucy5kb2N1bWVudFNlbGVjdG9yXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG9wdGlvbnMuc3luY2hyb25pemUpIHtcclxuICAgICAgICAgICAgY29uc3Qgc3luY2hyb25pemUgPSBvcHRpb25zLnN5bmNocm9uaXplO1xyXG4gICAgICAgICAgICBpZiAoc3luY2hyb25pemUuZ3JhbW1hclNjb3BlU2VsZWN0b3IpIHtcclxuICAgICAgICAgICAgICAgIGlmIChfLmlzQXJyYXkoc3luY2hyb25pemUuZ3JhbW1hclNjb3BlU2VsZWN0b3IpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JhbW1hclNjb3BlTmFtZVNlbGVjdG9ycyA9IHN5bmNocm9uaXplLmdyYW1tYXJTY29wZVNlbGVjdG9yO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBncmFtbWFyU2NvcGVOYW1lU2VsZWN0b3JzID0gW3N5bmNocm9uaXplLmdyYW1tYXJTY29wZVNlbGVjdG9yXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHN5bmNocm9uaXplLmV4dGVuc2lvblNlbGVjdG9yKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoXy5pc0FycmF5KHN5bmNocm9uaXplLmV4dGVuc2lvblNlbGVjdG9yKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV4dGVuc2lvblNlbGVjdG9ycyA9IHN5bmNocm9uaXplLmV4dGVuc2lvblNlbGVjdG9yO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBleHRlbnNpb25TZWxlY3RvcnMgPSBbc3luY2hyb25pemUuZXh0ZW5zaW9uU2VsZWN0b3JdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoc3luY2hyb25pemUudGV4dERvY3VtZW50RmlsdGVyKSB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0RG9jdW1lbnRGaWx0ZXIgPSBzeW5jaHJvbml6ZS50ZXh0RG9jdW1lbnRGaWx0ZXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHN5bmNFeHByZXNzaW9uczogSVN5bmNFeHByZXNzaW9uW10gPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKGdyYW1tYXJOYW1lU2VsZWN0b3JzKSB7XHJcbiAgICAgICAgICAgIHN5bmNFeHByZXNzaW9ucy5wdXNoKC4uLl8ubWFwKGdyYW1tYXJOYW1lU2VsZWN0b3JzLCBzZWxlY3RvciA9PiBuZXcgR3JhbW1hck5hbWVFeHByZXNzaW9uKHNlbGVjdG9yKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGV4dGVuc2lvblNlbGVjdG9ycykge1xyXG4gICAgICAgICAgICBzeW5jRXhwcmVzc2lvbnMucHVzaCguLi5fLm1hcChleHRlbnNpb25TZWxlY3RvcnMsIHNlbGVjdG9yID0+IG5ldyBHcmFtbWFyRmlsZVR5cGVFeHByZXNzaW9uKHNlbGVjdG9yKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGdyYW1tYXJTY29wZU5hbWVTZWxlY3RvcnMpIHtcclxuICAgICAgICAgICAgc3luY0V4cHJlc3Npb25zLnB1c2goLi4uXy5tYXAoZ3JhbW1hclNjb3BlTmFtZVNlbGVjdG9ycywgc2VsZWN0b3IgPT4gbmV3IEdyYW1tYXJTY29wZU5hbWVFeHByZXNzaW9uKHNlbGVjdG9yKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRleHREb2N1bWVudEZpbHRlcikge1xyXG4gICAgICAgICAgICBzeW5jRXhwcmVzc2lvbnMucHVzaChuZXcgVGV4dEVkaXRvclN5bmNFeHByZXNzaW9uKHRleHREb2N1bWVudEZpbHRlcikpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFzeW5jRXhwcmVzc2lvbnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRmFsc2VTeW5jRXhwcmVzc2lvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHN5bmNFeHByZXNzaW9ucy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN5bmNFeHByZXNzaW9uc1swXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgQ29tcG9zaXRlU3luY0V4cHJlc3Npb24oc3luY0V4cHJlc3Npb25zKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBldmFsdWF0ZShlZGl0b3I6IEF0b20uVGV4dEVkaXRvciB8IG51bGwgfCB1bmRlZmluZWQpOiBib29sZWFuO1xyXG59XHJcblxyXG5jbGFzcyBGYWxzZVN5bmNFeHByZXNzaW9uIGV4dGVuZHMgU3luY0V4cHJlc3Npb24ge1xyXG4gICAgcHVibGljIGV2YWx1YXRlKGVkaXRvcjogQXRvbS5UZXh0RWRpdG9yIHwgbnVsbCB8IHVuZGVmaW5lZCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgR3JhbW1hck5hbWVFeHByZXNzaW9uIGV4dGVuZHMgU3luY0V4cHJlc3Npb24ge1xyXG4gICAgcHJpdmF0ZSBfaWQ6IFJlZ0V4cDtcclxuICAgIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2lkID0gbmV3IFJlZ0V4cChgXiR7aWR9JGAsICdpJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGV2YWx1YXRlKGVkaXRvcjogQXRvbS5UZXh0RWRpdG9yIHwgbnVsbCB8IHVuZGVmaW5lZCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghZWRpdG9yKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgZ3JhbW1hciA9IGVkaXRvci5nZXRHcmFtbWFyKCk7XHJcbiAgICAgICAgcmV0dXJuICEhZ3JhbW1hci5uYW1lLm1hdGNoKHRoaXMuX2lkKTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgR3JhbW1hckZpbGVUeXBlRXhwcmVzc2lvbiBleHRlbmRzIFN5bmNFeHByZXNzaW9uIHtcclxuICAgIHByaXZhdGUgc3RhdGljIF9yZWdleHBDYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBSZWdFeHBbXT4oKTtcclxuICAgIHByaXZhdGUgc3RhdGljIF9maWx0ZXJQcmVkaWNhdGUgPSBfLm5lZ2F0ZShfLnBhcnRpYWwoXy5pc0VxdWFsLCAnc291cmNlJykpO1xyXG4gICAgcHJpdmF0ZSBfaWQ6IFJlZ0V4cDtcclxuICAgIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2lkID0gbmV3IFJlZ0V4cChgXiR7Xy50cmltU3RhcnQoaWQsICcuJyl9JGAsICdpJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGV2YWx1YXRlKGVkaXRvcjogQXRvbS5UZXh0RWRpdG9yIHwgbnVsbCB8IHVuZGVmaW5lZCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghZWRpdG9yKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgZ3JhbW1hciA9IGVkaXRvci5nZXRHcmFtbWFyKCk7XHJcbiAgICAgICAgcmV0dXJuIF8uc29tZShncmFtbWFyLmZpbGVUeXBlcywgZnQgPT4gZnQubWF0Y2godGhpcy5faWQpKTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgR3JhbW1hclNjb3BlTmFtZUV4cHJlc3Npb24gZXh0ZW5kcyBTeW5jRXhwcmVzc2lvbiB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfcmVnZXhwQ2FjaGUgPSBuZXcgTWFwPHN0cmluZywgUmVnRXhwW10+KCk7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfZmlsdGVyUHJlZGljYXRlID0gXy5uZWdhdGUoXy5wYXJ0aWFsKF8uaXNFcXVhbCwgJ3NvdXJjZScpKTtcclxuICAgIHByaXZhdGUgX2lkOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9pZCA9IGlkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBldmFsdWF0ZShlZGl0b3I6IEF0b20uVGV4dEVkaXRvciB8IG51bGwgfCB1bmRlZmluZWQpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIWVkaXRvcikge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGdyYW1tYXIgPSBlZGl0b3IuZ2V0R3JhbW1hcigpO1xyXG4gICAgICAgIGxldCByZWdleHBzID0gR3JhbW1hclNjb3BlTmFtZUV4cHJlc3Npb24uX3JlZ2V4cENhY2hlLmdldChncmFtbWFyLm5hbWUpO1xyXG4gICAgICAgIGlmICghcmVnZXhwcykge1xyXG4gICAgICAgICAgICByZWdleHBzID0gXyhncmFtbWFyLnNjb3BlTmFtZS5zcGxpdCgnLicpKS5maWx0ZXIoR3JhbW1hclNjb3BlTmFtZUV4cHJlc3Npb24uX2ZpbHRlclByZWRpY2F0ZSkubWFwKG5hbWUgPT4gbmV3IFJlZ0V4cChgXiR7bmFtZX0kYCwgJ2knKSkudmFsdWUoKTtcclxuICAgICAgICAgICAgR3JhbW1hclNjb3BlTmFtZUV4cHJlc3Npb24uX3JlZ2V4cENhY2hlLnNldChncmFtbWFyLm5hbWUsIHJlZ2V4cHMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIF8uc29tZShyZWdleHBzLCBuYW1lID0+IHRoaXMuX2lkLm1hdGNoKG5hbWUpKTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgVGV4dEVkaXRvclN5bmNFeHByZXNzaW9uIGV4dGVuZHMgU3luY0V4cHJlc3Npb24ge1xyXG4gICAgcHJpdmF0ZSBfZnVuYzogKGVkaXRvcjogQXRvbS5UZXh0RWRpdG9yKSA9PiBib29sZWFuO1xyXG4gICAgY29uc3RydWN0b3IoZnVuYzogKGVkaXRvcjogQXRvbS5UZXh0RWRpdG9yKSA9PiBib29sZWFuKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9mdW5jID0gZnVuYztcclxuICAgIH1cclxuICAgIHB1YmxpYyBldmFsdWF0ZShlZGl0b3I6IEF0b20uVGV4dEVkaXRvciB8IG51bGwgfCB1bmRlZmluZWQpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIWVkaXRvcikge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9mdW5jKGVkaXRvcik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIENvbXBvc2l0ZVN5bmNFeHByZXNzaW9uIGV4dGVuZHMgU3luY0V4cHJlc3Npb24ge1xyXG4gICAgcHJpdmF0ZSBfZXhwcmVzc2lvbjogSVN5bmNFeHByZXNzaW9uW107XHJcbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZXM6IElTeW5jRXhwcmVzc2lvbltdKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9leHByZXNzaW9uID0gdmFsdWVzO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGV2YWx1YXRlKGVkaXRvcjogQXRvbS5UZXh0RWRpdG9yIHwgbnVsbCB8IHVuZGVmaW5lZCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9leHByZXNzaW9uLnNvbWUoZXhwID0+IGV4cC5ldmFsdWF0ZShlZGl0b3IpKTtcclxuICAgIH1cclxufVxyXG4iXX0=