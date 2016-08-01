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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
var _ = require('lodash');
var atom_languageservices_1 = require('atom-languageservices');
var decorators_1 = require('atom-languageservices/decorators');
var types_1 = require('atom-languageservices/types');
var ts_disposables_1 = require('ts-disposables');
var AtomTextEditorSource_1 = require('../atom/AtomTextEditorSource');
var TextEditorSyncProtocol_1 = require('./TextEditorSyncProtocol');
var DocumentSyncProtocol = (function (_super) {
    __extends(DocumentSyncProtocol, _super);
    function DocumentSyncProtocol(client, syncExpression, documentDelayer, atomViewFinder, waitService, atomTextEditorSource) {
        var _this = this;
        _super.call(this);
        this._editors = new WeakMap();
        if (client.capabilities.textDocumentSync === types_1.TextDocumentSyncKind.None) {
            return;
        }
        this._client = client;
        this._syncExpression = syncExpression;
        this._documentDelayer = documentDelayer;
        this._atomTextEditorSource = atomTextEditorSource;
        this._atomViewFinder = atomViewFinder;
        this._waitService = waitService;
        this._configure();
        this._disposable.add(function () { return _this._editors.clear(); });
    }
    DocumentSyncProtocol.prototype._configure = function () {
        var _this = this;
        this._atomTextEditorSource.observeTextEditors
            .filter(function (editor) { return _this._syncExpression.evaluate(editor); })
            .subscribe(_.bind(this._configureEditor, this));
    };
    DocumentSyncProtocol.prototype._configureEditor = function (editor) {
        var _this = this;
        if (!this._editors.has(editor)) {
            var sync_1 = new TextEditorSyncProtocol_1.TextEditorSyncProtocol(this._client, this._syncExpression, this._documentDelayer, this._atomViewFinder, this._waitService, editor);
            this._editors.set(editor, sync_1);
            this._disposable.add(sync_1);
            this._disposable.add(editor.onDidDestroy(function () {
                _this._editors.delete(editor);
                _this._disposable.remove(sync_1);
                sync_1.dispose();
            }));
        }
    };
    DocumentSyncProtocol = __decorate([
        decorators_1.capability,
        __param(0, decorators_1.inject(atom_languageservices_1.ILanguageProtocolClient)),
        __param(1, decorators_1.inject(atom_languageservices_1.ISyncExpression)),
        __param(2, decorators_1.inject(atom_languageservices_1.IDocumentDelayer)),
        __param(3, decorators_1.inject(atom_languageservices_1.IAtomViewFinder)),
        __param(4, decorators_1.inject(atom_languageservices_1.IWaitService)), 
        __metadata('design:paramtypes', [Object, Object, Object, Object, Object, AtomTextEditorSource_1.AtomTextEditorSource])
    ], DocumentSyncProtocol);
    return DocumentSyncProtocol;
}(ts_disposables_1.DisposableBase));
exports.DocumentSyncProtocol = DocumentSyncProtocol;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9jdW1lbnRTeW5jUHJvdG9jb2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2FwYWJpbGl0aWVzL0RvY3VtZW50U3luY1Byb3RvY29sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCxJQUFZLENBQUMsV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUM1QixzQ0FBMEcsdUJBQXVCLENBQUMsQ0FBQTtBQUNsSSwyQkFBbUMsa0NBQWtDLENBQUMsQ0FBQTtBQUN0RSxzQkFBcUMsNkJBQTZCLENBQUMsQ0FBQTtBQUNuRSwrQkFBK0IsZ0JBQWdCLENBQUMsQ0FBQTtBQUNoRCxxQ0FBcUMsOEJBQThCLENBQUMsQ0FBQTtBQUNwRSx1Q0FBdUMsMEJBQTBCLENBQUMsQ0FBQTtBQUdsRTtJQUEwQyx3Q0FBYztJQVNwRCw4QkFDcUMsTUFBK0IsRUFDdkMsY0FBK0IsRUFDOUIsZUFBaUMsRUFDbEMsY0FBK0IsRUFDbEMsV0FBeUIsRUFDL0Msb0JBQTBDO1FBZmxELGlCQWtEQztRQWpDTyxpQkFBTyxDQUFDO1FBVkosYUFBUSxHQUFHLElBQUksT0FBTyxFQUEyQyxDQUFDO1FBV3RFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEtBQUssNEJBQW9CLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQztRQUFDLENBQUM7UUFDbkYsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7UUFDdEMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGVBQWUsQ0FBQztRQUN4QyxJQUFJLENBQUMscUJBQXFCLEdBQUcsb0JBQW9CLENBQUM7UUFDbEQsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7UUFDdEMsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7UUFFaEMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRWxCLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFyQixDQUFxQixDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVPLHlDQUFVLEdBQWxCO1FBQUEsaUJBSUM7UUFIRyxJQUFJLENBQUMscUJBQXFCLENBQUMsa0JBQWtCO2FBQ3hDLE1BQU0sQ0FBQyxVQUFBLE1BQU0sSUFBSSxPQUFBLEtBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFyQyxDQUFxQyxDQUFDO2FBQ3ZELFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFTywrQ0FBZ0IsR0FBeEIsVUFBeUIsTUFBdUI7UUFBaEQsaUJBWUM7UUFYRyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFNLE1BQUksR0FBRyxJQUFJLCtDQUFzQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBRXBKLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFJLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFJLENBQUMsQ0FBQztZQUMzQixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDO2dCQUNyQyxLQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDN0IsS0FBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBSSxDQUFDLENBQUM7Z0JBQzlCLE1BQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNuQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1IsQ0FBQztJQUNMLENBQUM7SUFsREw7UUFBQyx1QkFBVTttQkFXRixtQkFBTSxDQUFDLCtDQUF1QixDQUFDO21CQUMvQixtQkFBTSxDQUFDLHVDQUFlLENBQUM7bUJBQ3ZCLG1CQUFNLENBQUMsd0NBQWdCLENBQUM7bUJBQ3hCLG1CQUFNLENBQUMsdUNBQWUsQ0FBQzttQkFDdkIsbUJBQU0sQ0FBQyxvQ0FBWSxDQUFDOzs0QkFmbEI7SUFtRFgsMkJBQUM7QUFBRCxDQUFDLEFBbERELENBQTBDLCtCQUFjLEdBa0R2RDtBQWxEWSw0QkFBb0IsdUJBa0RoQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBJQXRvbVZpZXdGaW5kZXIsIElEb2N1bWVudERlbGF5ZXIsIElMYW5ndWFnZVByb3RvY29sQ2xpZW50LCBJU3luY0V4cHJlc3Npb24sIElXYWl0U2VydmljZSB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCB7IGNhcGFiaWxpdHksIGluamVjdCB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9kZWNvcmF0b3JzJztcclxuaW1wb3J0IHsgVGV4dERvY3VtZW50U3luY0tpbmQgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvdHlwZXMnO1xyXG5pbXBvcnQgeyBEaXNwb3NhYmxlQmFzZSB9IGZyb20gJ3RzLWRpc3Bvc2FibGVzJztcclxuaW1wb3J0IHsgQXRvbVRleHRFZGl0b3JTb3VyY2UgfSBmcm9tICcuLi9hdG9tL0F0b21UZXh0RWRpdG9yU291cmNlJztcclxuaW1wb3J0IHsgVGV4dEVkaXRvclN5bmNQcm90b2NvbCB9IGZyb20gJy4vVGV4dEVkaXRvclN5bmNQcm90b2NvbCc7XHJcblxyXG5AY2FwYWJpbGl0eVxyXG5leHBvcnQgY2xhc3MgRG9jdW1lbnRTeW5jUHJvdG9jb2wgZXh0ZW5kcyBEaXNwb3NhYmxlQmFzZSB7XHJcbiAgICBwcml2YXRlIF9jbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50O1xyXG4gICAgcHJpdmF0ZSBfYXRvbVRleHRFZGl0b3JTb3VyY2U6IEF0b21UZXh0RWRpdG9yU291cmNlO1xyXG4gICAgcHJpdmF0ZSBfc3luY0V4cHJlc3Npb246IElTeW5jRXhwcmVzc2lvbjtcclxuICAgIHByaXZhdGUgX2RvY3VtZW50RGVsYXllcjogSURvY3VtZW50RGVsYXllcjtcclxuICAgIHByaXZhdGUgX2F0b21WaWV3RmluZGVyOiBJQXRvbVZpZXdGaW5kZXI7XHJcbiAgICBwcml2YXRlIF93YWl0U2VydmljZTogSVdhaXRTZXJ2aWNlO1xyXG4gICAgcHJpdmF0ZSBfZWRpdG9ycyA9IG5ldyBXZWFrTWFwPEF0b20uVGV4dEVkaXRvciwgVGV4dEVkaXRvclN5bmNQcm90b2NvbD4oKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBAaW5qZWN0KElMYW5ndWFnZVByb3RvY29sQ2xpZW50KSBjbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50LFxyXG4gICAgICAgIEBpbmplY3QoSVN5bmNFeHByZXNzaW9uKSBzeW5jRXhwcmVzc2lvbjogSVN5bmNFeHByZXNzaW9uLFxyXG4gICAgICAgIEBpbmplY3QoSURvY3VtZW50RGVsYXllcikgZG9jdW1lbnREZWxheWVyOiBJRG9jdW1lbnREZWxheWVyLFxyXG4gICAgICAgIEBpbmplY3QoSUF0b21WaWV3RmluZGVyKSBhdG9tVmlld0ZpbmRlcjogSUF0b21WaWV3RmluZGVyLFxyXG4gICAgICAgIEBpbmplY3QoSVdhaXRTZXJ2aWNlKSB3YWl0U2VydmljZTogSVdhaXRTZXJ2aWNlLFxyXG4gICAgICAgIGF0b21UZXh0RWRpdG9yU291cmNlOiBBdG9tVGV4dEVkaXRvclNvdXJjZVxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBpZiAoY2xpZW50LmNhcGFiaWxpdGllcy50ZXh0RG9jdW1lbnRTeW5jID09PSBUZXh0RG9jdW1lbnRTeW5jS2luZC5Ob25lKSB7IHJldHVybjsgfVxyXG4gICAgICAgIHRoaXMuX2NsaWVudCA9IGNsaWVudDtcclxuICAgICAgICB0aGlzLl9zeW5jRXhwcmVzc2lvbiA9IHN5bmNFeHByZXNzaW9uO1xyXG4gICAgICAgIHRoaXMuX2RvY3VtZW50RGVsYXllciA9IGRvY3VtZW50RGVsYXllcjtcclxuICAgICAgICB0aGlzLl9hdG9tVGV4dEVkaXRvclNvdXJjZSA9IGF0b21UZXh0RWRpdG9yU291cmNlO1xyXG4gICAgICAgIHRoaXMuX2F0b21WaWV3RmluZGVyID0gYXRvbVZpZXdGaW5kZXI7XHJcbiAgICAgICAgdGhpcy5fd2FpdFNlcnZpY2UgPSB3YWl0U2VydmljZTtcclxuXHJcbiAgICAgICAgdGhpcy5fY29uZmlndXJlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuX2Rpc3Bvc2FibGUuYWRkKCgpID0+IHRoaXMuX2VkaXRvcnMuY2xlYXIoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfY29uZmlndXJlKCkge1xyXG4gICAgICAgIHRoaXMuX2F0b21UZXh0RWRpdG9yU291cmNlLm9ic2VydmVUZXh0RWRpdG9yc1xyXG4gICAgICAgICAgICAuZmlsdGVyKGVkaXRvciA9PiB0aGlzLl9zeW5jRXhwcmVzc2lvbi5ldmFsdWF0ZShlZGl0b3IpKVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKF8uYmluZCh0aGlzLl9jb25maWd1cmVFZGl0b3IsIHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9jb25maWd1cmVFZGl0b3IoZWRpdG9yOiBBdG9tLlRleHRFZGl0b3IpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2VkaXRvcnMuaGFzKGVkaXRvcikpIHtcclxuICAgICAgICAgICAgY29uc3Qgc3luYyA9IG5ldyBUZXh0RWRpdG9yU3luY1Byb3RvY29sKHRoaXMuX2NsaWVudCwgdGhpcy5fc3luY0V4cHJlc3Npb24sIHRoaXMuX2RvY3VtZW50RGVsYXllciwgdGhpcy5fYXRvbVZpZXdGaW5kZXIsIHRoaXMuX3dhaXRTZXJ2aWNlLCBlZGl0b3IpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fZWRpdG9ycy5zZXQoZWRpdG9yLCBzeW5jKTtcclxuICAgICAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQoc3luYyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2Rpc3Bvc2FibGUuYWRkKGVkaXRvci5vbkRpZERlc3Ryb3koKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZWRpdG9ycy5kZWxldGUoZWRpdG9yKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3Bvc2FibGUucmVtb3ZlKHN5bmMpO1xyXG4gICAgICAgICAgICAgICAgc3luYy5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19