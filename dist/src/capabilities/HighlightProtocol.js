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
var protocol_extended_1 = require('atom-languageservices/protocol-extended');
var ts_disposables_1 = require('ts-disposables');
var convert_1 = require('./utils/convert');
var AtomTextEditorSource_1 = require('../atom/AtomTextEditorSource');
var HighlightProtocol = (function (_super) {
    __extends(HighlightProtocol, _super);
    function HighlightProtocol(client, highlighterService, atomTextEditorSource) {
        _super.call(this);
        this._highlighterService = highlighterService;
        this._atomTextEditorSource = atomTextEditorSource;
        this._highlighter = this._highlighterService.getHighlighter();
        this._disposable.add(this._highlighter);
        this._client = client;
        this._configure();
    }
    HighlightProtocol.prototype._updateHighlights = function (editor, added, removed) {
        this._highlighter.updateHighlights(editor, added, removed);
    };
    HighlightProtocol.prototype._configure = function () {
        this._client.onNotification(protocol_extended_1.HighlightNotification.type, _.bind(this._recieveHighlights, this));
    };
    HighlightProtocol.prototype._recieveHighlights = function (_a) {
        var uri = _a.uri, added = _a.added, removed = _a.removed;
        uri = convert_1.fromUri(uri) || uri;
        var editor = _.find(this._atomTextEditorSource.textEditors, function (x) { return x.getPath() === uri; });
        if (editor) {
            this._updateHighlights(editor, this._fromHighlights(uri, added), removed);
        }
    };
    HighlightProtocol.prototype._fromHighlights = function (path, diagnostics) {
        return _.map(diagnostics, _.bind(this._fromDiagnostic, this, path));
    };
    HighlightProtocol.prototype._fromDiagnostic = function (path, highlight) {
        return {
            id: highlight.id,
            range: convert_1.fromRange(highlight.range),
            kind: highlight.kind
        };
    };
    HighlightProtocol = __decorate([
        decorators_1.capability(),
        __param(0, decorators_1.inject(atom_languageservices_1.ILanguageProtocolClient)),
        __param(1, decorators_1.inject(atom_languageservices_1.IHighlightService)), 
        __metadata('design:paramtypes', [Object, Object, AtomTextEditorSource_1.AtomTextEditorSource])
    ], HighlightProtocol);
    return HighlightProtocol;
}(ts_disposables_1.DisposableBase));
exports.HighlightProtocol = HighlightProtocol;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGlnaGxpZ2h0UHJvdG9jb2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2FwYWJpbGl0aWVzL0hpZ2hsaWdodFByb3RvY29sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCxJQUFZLENBQUMsV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUM1QixzQ0FBc0UsdUJBQXVCLENBQUMsQ0FBQTtBQUM5RiwyQkFBbUMsa0NBQWtDLENBQUMsQ0FBQTtBQUN0RSxrQ0FBc0MseUNBQXlDLENBQUMsQ0FBQTtBQUVoRiwrQkFBK0IsZ0JBQWdCLENBQUMsQ0FBQTtBQUNoRCx3QkFBbUMsaUJBQWlCLENBQUMsQ0FBQTtBQUNyRCxxQ0FBcUMsOEJBQThCLENBQUMsQ0FBQTtBQUdwRTtJQUF1QyxxQ0FBYztJQU1qRCwyQkFDcUMsTUFBK0IsRUFDckMsa0JBQXFDLEVBQ2hFLG9CQUEwQztRQUMxQyxpQkFBTyxDQUFDO1FBQ1IsSUFBSSxDQUFDLG1CQUFtQixHQUFHLGtCQUFrQixDQUFDO1FBQzlDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxvQkFBb0IsQ0FBQztRQUNsRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUM5RCxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFFdEIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFTyw2Q0FBaUIsR0FBekIsVUFBMEIsTUFBdUIsRUFBRSxLQUF1QixFQUFFLE9BQWlCO1FBQ3pGLElBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRU8sc0NBQVUsR0FBbEI7UUFDSSxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyx5Q0FBcUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNuRyxDQUFDO0lBRU8sOENBQWtCLEdBQTFCLFVBQTJCLEVBQTZDO1lBQTVDLFlBQUcsRUFBRSxnQkFBSyxFQUFFLG9CQUFPO1FBQzNDLEdBQUcsR0FBRyxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQztRQUMxQixJQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLEVBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsT0FBTyxFQUFFLEtBQUssR0FBRyxFQUFuQixDQUFtQixDQUFDLENBQUM7UUFDeEYsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNULElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDOUUsQ0FBQztJQUNMLENBQUM7SUFFTywyQ0FBZSxHQUF2QixVQUF3QixJQUFZLEVBQUUsV0FBNEI7UUFDOUQsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBRU8sMkNBQWUsR0FBdkIsVUFBd0IsSUFBWSxFQUFFLFNBQXdCO1FBQzFELE1BQU0sQ0FBQztZQUNILEVBQUUsRUFBRSxTQUFTLENBQUMsRUFBRTtZQUNoQixLQUFLLEVBQUUsbUJBQVMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1lBQ2pDLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSTtTQUN2QixDQUFDO0lBQ04sQ0FBQztJQS9DTDtRQUFDLHVCQUFVLEVBQUU7bUJBUUosbUJBQU0sQ0FBQywrQ0FBdUIsQ0FBQzttQkFDL0IsbUJBQU0sQ0FBQyx5Q0FBaUIsQ0FBQzs7eUJBVHJCO0lBZ0RiLHdCQUFDO0FBQUQsQ0FBQyxBQS9DRCxDQUF1QywrQkFBYyxHQStDcEQ7QUEvQ1kseUJBQWlCLG9CQStDN0IsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiAgQGxpY2Vuc2UgICBNSVRcclxuICogIEBjb3B5cmlnaHQgT21uaVNoYXJwIFRlYW1cclxuICogIEBzdW1tYXJ5ICAgQWRkcyBzdXBwb3J0IGZvciBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L2xhbmd1YWdlLXNlcnZlci1wcm90b2NvbCAoYW5kIG1vcmUhKSB0byBodHRwczovL2F0b20uaW9cclxuICovXHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgSGlnaGxpZ2h0LCBJSGlnaGxpZ2h0U2VydmljZSwgSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMnO1xyXG5pbXBvcnQgeyBjYXBhYmlsaXR5LCBpbmplY3QgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvZGVjb3JhdG9ycyc7XHJcbmltcG9ydCB7IEhpZ2hsaWdodE5vdGlmaWNhdGlvbiB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9wcm90b2NvbC1leHRlbmRlZCc7XHJcbmltcG9ydCB7IEhpZ2hsaWdodCBhcyBIaWdobGlnaHRJdGVtLCBQdWJsaXNoSGlnaGxpZ2h0UGFyYW1zIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL3R5cGVzLWV4dGVuZGVkJztcclxuaW1wb3J0IHsgRGlzcG9zYWJsZUJhc2UgfSBmcm9tICd0cy1kaXNwb3NhYmxlcyc7XHJcbmltcG9ydCB7IGZyb21SYW5nZSwgZnJvbVVyaSB9IGZyb20gJy4vdXRpbHMvY29udmVydCc7XHJcbmltcG9ydCB7IEF0b21UZXh0RWRpdG9yU291cmNlIH0gZnJvbSAnLi4vYXRvbS9BdG9tVGV4dEVkaXRvclNvdXJjZSc7XHJcblxyXG5AY2FwYWJpbGl0eSgpXHJcbmV4cG9ydCBjbGFzcyBIaWdobGlnaHRQcm90b2NvbCBleHRlbmRzIERpc3Bvc2FibGVCYXNlIHtcclxuICAgIHByaXZhdGUgX2NsaWVudDogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQ7XHJcbiAgICBwcml2YXRlIF9oaWdobGlnaHRlclNlcnZpY2U6IElIaWdobGlnaHRTZXJ2aWNlO1xyXG4gICAgcHJpdmF0ZSBfaGlnaGxpZ2h0ZXI6IEhpZ2hsaWdodC5IaWdobGlnaHRlcjtcclxuICAgIHByaXZhdGUgX2F0b21UZXh0RWRpdG9yU291cmNlOiBBdG9tVGV4dEVkaXRvclNvdXJjZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBAaW5qZWN0KElMYW5ndWFnZVByb3RvY29sQ2xpZW50KSBjbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50LFxyXG4gICAgICAgIEBpbmplY3QoSUhpZ2hsaWdodFNlcnZpY2UpIGhpZ2hsaWdodGVyU2VydmljZTogSUhpZ2hsaWdodFNlcnZpY2UsXHJcbiAgICAgICAgYXRvbVRleHRFZGl0b3JTb3VyY2U6IEF0b21UZXh0RWRpdG9yU291cmNlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9oaWdobGlnaHRlclNlcnZpY2UgPSBoaWdobGlnaHRlclNlcnZpY2U7XHJcbiAgICAgICAgdGhpcy5fYXRvbVRleHRFZGl0b3JTb3VyY2UgPSBhdG9tVGV4dEVkaXRvclNvdXJjZTtcclxuICAgICAgICB0aGlzLl9oaWdobGlnaHRlciA9IHRoaXMuX2hpZ2hsaWdodGVyU2VydmljZS5nZXRIaWdobGlnaHRlcigpO1xyXG4gICAgICAgIHRoaXMuX2Rpc3Bvc2FibGUuYWRkKHRoaXMuX2hpZ2hsaWdodGVyKTtcclxuICAgICAgICB0aGlzLl9jbGllbnQgPSBjbGllbnQ7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3VwZGF0ZUhpZ2hsaWdodHMoZWRpdG9yOiBBdG9tLlRleHRFZGl0b3IsIGFkZGVkOiBIaWdobGlnaHQuSXRlbVtdLCByZW1vdmVkOiBzdHJpbmdbXSkge1xyXG4gICAgICAgIHRoaXMuX2hpZ2hsaWdodGVyLnVwZGF0ZUhpZ2hsaWdodHMoZWRpdG9yLCBhZGRlZCwgcmVtb3ZlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfY29uZmlndXJlKCkge1xyXG4gICAgICAgIHRoaXMuX2NsaWVudC5vbk5vdGlmaWNhdGlvbihIaWdobGlnaHROb3RpZmljYXRpb24udHlwZSwgXy5iaW5kKHRoaXMuX3JlY2lldmVIaWdobGlnaHRzLCB0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcmVjaWV2ZUhpZ2hsaWdodHMoe3VyaSwgYWRkZWQsIHJlbW92ZWR9OiBQdWJsaXNoSGlnaGxpZ2h0UGFyYW1zKSB7XHJcbiAgICAgICAgdXJpID0gZnJvbVVyaSh1cmkpIHx8IHVyaTtcclxuICAgICAgICBjb25zdCBlZGl0b3IgPSBfLmZpbmQodGhpcy5fYXRvbVRleHRFZGl0b3JTb3VyY2UudGV4dEVkaXRvcnMsIHggPT4geC5nZXRQYXRoKCkgPT09IHVyaSk7XHJcbiAgICAgICAgaWYgKGVkaXRvcikge1xyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVIaWdobGlnaHRzKGVkaXRvciwgdGhpcy5fZnJvbUhpZ2hsaWdodHModXJpLCBhZGRlZCksIHJlbW92ZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9mcm9tSGlnaGxpZ2h0cyhwYXRoOiBzdHJpbmcsIGRpYWdub3N0aWNzOiBIaWdobGlnaHRJdGVtW10pOiBIaWdobGlnaHQuSXRlbVtdIHtcclxuICAgICAgICByZXR1cm4gXy5tYXAoZGlhZ25vc3RpY3MsIF8uYmluZCh0aGlzLl9mcm9tRGlhZ25vc3RpYywgdGhpcywgcGF0aCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2Zyb21EaWFnbm9zdGljKHBhdGg6IHN0cmluZywgaGlnaGxpZ2h0OiBIaWdobGlnaHRJdGVtKTogSGlnaGxpZ2h0Lkl0ZW0ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGlkOiBoaWdobGlnaHQuaWQsXHJcbiAgICAgICAgICAgIHJhbmdlOiBmcm9tUmFuZ2UoaGlnaGxpZ2h0LnJhbmdlKSxcclxuICAgICAgICAgICAga2luZDogaGlnaGxpZ2h0LmtpbmRcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcbiJdfQ==