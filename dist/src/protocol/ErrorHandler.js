"use strict";
/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
var atom_languageservices_1 = require('atom-languageservices');
var DefaultErrorHandler = (function () {
    function DefaultErrorHandler(name) {
        this.name = name;
        this.restarts = [];
    }
    DefaultErrorHandler.prototype.error = function (error, message, count) {
        if (count && count <= 3) {
            return atom_languageservices_1.ErrorAction.Continue;
        }
        return atom_languageservices_1.ErrorAction.Shutdown;
    };
    DefaultErrorHandler.prototype.closed = function () {
        this.restarts.push(Date.now());
        if (this.restarts.length < 5) {
            return atom_languageservices_1.CloseAction.Restart;
        }
        else {
            var diff = this.restarts[this.restarts.length - 1] - this.restarts[0];
            if (diff <= 3 * 60 * 1000) {
                atom.notifications.addError("The " + this.name + " server crashed 5 times in the last 3 minutes. The server will not be restarted.");
                return atom_languageservices_1.CloseAction.DoNotRestart;
            }
            else {
                this.restarts.shift();
                return atom_languageservices_1.CloseAction.Restart;
            }
        }
    };
    return DefaultErrorHandler;
}());
exports.DefaultErrorHandler = DefaultErrorHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXJyb3JIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Byb3RvY29sL0Vycm9ySGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRztBQUNILHNDQUF3RCx1QkFBdUIsQ0FBQyxDQUFBO0FBR2hGO0lBSUksNkJBQVksSUFBWTtRQUNwQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRU0sbUNBQUssR0FBWixVQUFhLEtBQVksRUFBRSxPQUFnQixFQUFFLEtBQWE7UUFDdEQsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sQ0FBQyxtQ0FBVyxDQUFDLFFBQVEsQ0FBQztRQUNoQyxDQUFDO1FBQ0QsTUFBTSxDQUFDLG1DQUFXLENBQUMsUUFBUSxDQUFDO0lBQ2hDLENBQUM7SUFDTSxvQ0FBTSxHQUFiO1FBQ0ksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDL0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQixNQUFNLENBQUMsbUNBQVcsQ0FBQyxPQUFPLENBQUM7UUFDL0IsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hFLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFNBQU8sSUFBSSxDQUFDLElBQUkscUZBQWtGLENBQUMsQ0FBQztnQkFDaEksTUFBTSxDQUFDLG1DQUFXLENBQUMsWUFBWSxDQUFDO1lBQ3BDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUN0QixNQUFNLENBQUMsbUNBQVcsQ0FBQyxPQUFPLENBQUM7WUFDL0IsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBQ0wsMEJBQUM7QUFBRCxDQUFDLEFBOUJELElBOEJDO0FBOUJZLDJCQUFtQixzQkE4Qi9CLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogIEBsaWNlbnNlICAgTUlUXHJcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG5pbXBvcnQgeyBDbG9zZUFjdGlvbiwgRXJyb3JBY3Rpb24sIElFcnJvckhhbmRsZXIgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMnO1xyXG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAndnNjb2RlLWpzb25ycGMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIERlZmF1bHRFcnJvckhhbmRsZXIgaW1wbGVtZW50cyBJRXJyb3JIYW5kbGVyIHtcclxuICAgIHByaXZhdGUgbmFtZTogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSByZXN0YXJ0czogbnVtYmVyW107XHJcblxyXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLnJlc3RhcnRzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVycm9yKGVycm9yOiBFcnJvciwgbWVzc2FnZTogTWVzc2FnZSwgY291bnQ6IG51bWJlcik6IEVycm9yQWN0aW9uIHtcclxuICAgICAgICBpZiAoY291bnQgJiYgY291bnQgPD0gMykge1xyXG4gICAgICAgICAgICByZXR1cm4gRXJyb3JBY3Rpb24uQ29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBFcnJvckFjdGlvbi5TaHV0ZG93bjtcclxuICAgIH1cclxuICAgIHB1YmxpYyBjbG9zZWQoKTogQ2xvc2VBY3Rpb24ge1xyXG4gICAgICAgIHRoaXMucmVzdGFydHMucHVzaChEYXRlLm5vdygpKTtcclxuICAgICAgICBpZiAodGhpcy5yZXN0YXJ0cy5sZW5ndGggPCA1KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBDbG9zZUFjdGlvbi5SZXN0YXJ0O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpZmYgPSB0aGlzLnJlc3RhcnRzW3RoaXMucmVzdGFydHMubGVuZ3RoIC0gMV0gLSB0aGlzLnJlc3RhcnRzWzBdO1xyXG4gICAgICAgICAgICBpZiAoZGlmZiA8PSAzICogNjAgKiAxMDAwKSB7XHJcbiAgICAgICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoYFRoZSAke3RoaXMubmFtZX0gc2VydmVyIGNyYXNoZWQgNSB0aW1lcyBpbiB0aGUgbGFzdCAzIG1pbnV0ZXMuIFRoZSBzZXJ2ZXIgd2lsbCBub3QgYmUgcmVzdGFydGVkLmApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIENsb3NlQWN0aW9uLkRvTm90UmVzdGFydDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzdGFydHMuc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBDbG9zZUFjdGlvbi5SZXN0YXJ0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==