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
        decorators_1.capability(function (capabilities) { return capabilities.textDocumentSync !== types_1.TextDocumentSyncKind.None; }),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9jdW1lbnRTeW5jUHJvdG9jb2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2FwYWJpbGl0aWVzL0RvY3VtZW50U3luY1Byb3RvY29sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCxJQUFZLENBQUMsV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUM1QixzQ0FBMEcsdUJBQXVCLENBQUMsQ0FBQTtBQUNsSSwyQkFBbUMsa0NBQWtDLENBQUMsQ0FBQTtBQUN0RSxzQkFBcUMsNkJBQTZCLENBQUMsQ0FBQTtBQUNuRSwrQkFBK0IsZ0JBQWdCLENBQUMsQ0FBQTtBQUNoRCxxQ0FBcUMsOEJBQThCLENBQUMsQ0FBQTtBQUNwRSx1Q0FBdUMsMEJBQTBCLENBQUMsQ0FBQTtBQUdsRTtJQUEwQyx3Q0FBYztJQVNwRCw4QkFDcUMsTUFBK0IsRUFDdkMsY0FBK0IsRUFDOUIsZUFBaUMsRUFDbEMsY0FBK0IsRUFDbEMsV0FBeUIsRUFDL0Msb0JBQTBDO1FBZmxELGlCQWlEQztRQWhDTyxpQkFBTyxDQUFDO1FBVkosYUFBUSxHQUFHLElBQUksT0FBTyxFQUEyQyxDQUFDO1FBV3RFLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxlQUFlLEdBQUcsY0FBYyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxlQUFlLENBQUM7UUFDeEMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLG9CQUFvQixDQUFDO1FBQ2xELElBQUksQ0FBQyxlQUFlLEdBQUcsY0FBYyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO1FBRWhDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUVsQixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBckIsQ0FBcUIsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFTyx5Q0FBVSxHQUFsQjtRQUFBLGlCQUlDO1FBSEcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQjthQUN4QyxNQUFNLENBQUMsVUFBQSxNQUFNLElBQUksT0FBQSxLQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBckMsQ0FBcUMsQ0FBQzthQUN2RCxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRU8sK0NBQWdCLEdBQXhCLFVBQXlCLE1BQXVCO1FBQWhELGlCQVlDO1FBWEcsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBTSxNQUFJLEdBQUcsSUFBSSwrQ0FBc0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQztZQUVwSixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBSSxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsTUFBSSxDQUFDLENBQUM7WUFDM0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQztnQkFDckMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzdCLEtBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQUksQ0FBQyxDQUFDO2dCQUM5QixNQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDbkIsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNSLENBQUM7SUFDTCxDQUFDO0lBakRMO1FBQUMsdUJBQVUsQ0FBQyxVQUFDLFlBQVksSUFBSyxPQUFBLFlBQVksQ0FBQyxnQkFBZ0IsS0FBSyw0QkFBb0IsQ0FBQyxJQUFJLEVBQTNELENBQTJELENBQUM7bUJBV2pGLG1CQUFNLENBQUMsK0NBQXVCLENBQUM7bUJBQy9CLG1CQUFNLENBQUMsdUNBQWUsQ0FBQzttQkFDdkIsbUJBQU0sQ0FBQyx3Q0FBZ0IsQ0FBQzttQkFDeEIsbUJBQU0sQ0FBQyx1Q0FBZSxDQUFDO21CQUN2QixtQkFBTSxDQUFDLG9DQUFZLENBQUM7OzRCQWY2RDtJQWtEMUYsMkJBQUM7QUFBRCxDQUFDLEFBakRELENBQTBDLCtCQUFjLEdBaUR2RDtBQWpEWSw0QkFBb0IsdUJBaURoQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBJQXRvbVZpZXdGaW5kZXIsIElEb2N1bWVudERlbGF5ZXIsIElMYW5ndWFnZVByb3RvY29sQ2xpZW50LCBJU3luY0V4cHJlc3Npb24sIElXYWl0U2VydmljZSB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCB7IGNhcGFiaWxpdHksIGluamVjdCB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9kZWNvcmF0b3JzJztcclxuaW1wb3J0IHsgVGV4dERvY3VtZW50U3luY0tpbmQgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvdHlwZXMnO1xyXG5pbXBvcnQgeyBEaXNwb3NhYmxlQmFzZSB9IGZyb20gJ3RzLWRpc3Bvc2FibGVzJztcclxuaW1wb3J0IHsgQXRvbVRleHRFZGl0b3JTb3VyY2UgfSBmcm9tICcuLi9hdG9tL0F0b21UZXh0RWRpdG9yU291cmNlJztcclxuaW1wb3J0IHsgVGV4dEVkaXRvclN5bmNQcm90b2NvbCB9IGZyb20gJy4vVGV4dEVkaXRvclN5bmNQcm90b2NvbCc7XHJcblxyXG5AY2FwYWJpbGl0eSgoY2FwYWJpbGl0aWVzKSA9PiBjYXBhYmlsaXRpZXMudGV4dERvY3VtZW50U3luYyAhPT0gVGV4dERvY3VtZW50U3luY0tpbmQuTm9uZSlcclxuZXhwb3J0IGNsYXNzIERvY3VtZW50U3luY1Byb3RvY29sIGV4dGVuZHMgRGlzcG9zYWJsZUJhc2Uge1xyXG4gICAgcHJpdmF0ZSBfY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudDtcclxuICAgIHByaXZhdGUgX2F0b21UZXh0RWRpdG9yU291cmNlOiBBdG9tVGV4dEVkaXRvclNvdXJjZTtcclxuICAgIHByaXZhdGUgX3N5bmNFeHByZXNzaW9uOiBJU3luY0V4cHJlc3Npb247XHJcbiAgICBwcml2YXRlIF9kb2N1bWVudERlbGF5ZXI6IElEb2N1bWVudERlbGF5ZXI7XHJcbiAgICBwcml2YXRlIF9hdG9tVmlld0ZpbmRlcjogSUF0b21WaWV3RmluZGVyO1xyXG4gICAgcHJpdmF0ZSBfd2FpdFNlcnZpY2U6IElXYWl0U2VydmljZTtcclxuICAgIHByaXZhdGUgX2VkaXRvcnMgPSBuZXcgV2Vha01hcDxBdG9tLlRleHRFZGl0b3IsIFRleHRFZGl0b3JTeW5jUHJvdG9jb2w+KCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgQGluamVjdChJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCkgY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCxcclxuICAgICAgICBAaW5qZWN0KElTeW5jRXhwcmVzc2lvbikgc3luY0V4cHJlc3Npb246IElTeW5jRXhwcmVzc2lvbixcclxuICAgICAgICBAaW5qZWN0KElEb2N1bWVudERlbGF5ZXIpIGRvY3VtZW50RGVsYXllcjogSURvY3VtZW50RGVsYXllcixcclxuICAgICAgICBAaW5qZWN0KElBdG9tVmlld0ZpbmRlcikgYXRvbVZpZXdGaW5kZXI6IElBdG9tVmlld0ZpbmRlcixcclxuICAgICAgICBAaW5qZWN0KElXYWl0U2VydmljZSkgd2FpdFNlcnZpY2U6IElXYWl0U2VydmljZSxcclxuICAgICAgICBhdG9tVGV4dEVkaXRvclNvdXJjZTogQXRvbVRleHRFZGl0b3JTb3VyY2VcclxuICAgICkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fY2xpZW50ID0gY2xpZW50O1xyXG4gICAgICAgIHRoaXMuX3N5bmNFeHByZXNzaW9uID0gc3luY0V4cHJlc3Npb247XHJcbiAgICAgICAgdGhpcy5fZG9jdW1lbnREZWxheWVyID0gZG9jdW1lbnREZWxheWVyO1xyXG4gICAgICAgIHRoaXMuX2F0b21UZXh0RWRpdG9yU291cmNlID0gYXRvbVRleHRFZGl0b3JTb3VyY2U7XHJcbiAgICAgICAgdGhpcy5fYXRvbVZpZXdGaW5kZXIgPSBhdG9tVmlld0ZpbmRlcjtcclxuICAgICAgICB0aGlzLl93YWl0U2VydmljZSA9IHdhaXRTZXJ2aWNlO1xyXG5cclxuICAgICAgICB0aGlzLl9jb25maWd1cmUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQoKCkgPT4gdGhpcy5fZWRpdG9ycy5jbGVhcigpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9jb25maWd1cmUoKSB7XHJcbiAgICAgICAgdGhpcy5fYXRvbVRleHRFZGl0b3JTb3VyY2Uub2JzZXJ2ZVRleHRFZGl0b3JzXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZWRpdG9yID0+IHRoaXMuX3N5bmNFeHByZXNzaW9uLmV2YWx1YXRlKGVkaXRvcikpXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoXy5iaW5kKHRoaXMuX2NvbmZpZ3VyZUVkaXRvciwgdGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2NvbmZpZ3VyZUVkaXRvcihlZGl0b3I6IEF0b20uVGV4dEVkaXRvcikge1xyXG4gICAgICAgIGlmICghdGhpcy5fZWRpdG9ycy5oYXMoZWRpdG9yKSkge1xyXG4gICAgICAgICAgICBjb25zdCBzeW5jID0gbmV3IFRleHRFZGl0b3JTeW5jUHJvdG9jb2wodGhpcy5fY2xpZW50LCB0aGlzLl9zeW5jRXhwcmVzc2lvbiwgdGhpcy5fZG9jdW1lbnREZWxheWVyLCB0aGlzLl9hdG9tVmlld0ZpbmRlciwgdGhpcy5fd2FpdFNlcnZpY2UsIGVkaXRvcik7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9lZGl0b3JzLnNldChlZGl0b3IsIHN5bmMpO1xyXG4gICAgICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLmFkZChzeW5jKTtcclxuICAgICAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQoZWRpdG9yLm9uRGlkRGVzdHJveSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9lZGl0b3JzLmRlbGV0ZShlZGl0b3IpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5yZW1vdmUoc3luYyk7XHJcbiAgICAgICAgICAgICAgICBzeW5jLmRpc3Bvc2UoKTtcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=