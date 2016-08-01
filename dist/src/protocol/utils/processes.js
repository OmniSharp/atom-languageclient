"use strict";
/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable */
var cp = require('child_process');
var isWindows = (process.platform === 'win32');
var isMacintosh = (process.platform === 'darwin');
var isLinux = (process.platform === 'linux');
function terminate(process, cwd) {
    if (isWindows) {
        try {
            // This we run in Atom execFileSync is available.
            // Ignore stderr since this is otherwise piped to parent.stderr
            // which might be already closed.
            var options = {
                stdio: ['pipe', 'pipe', 'ignore']
            };
            if (cwd) {
                options.cwd = cwd;
            }
            cp.execFileSync('taskkill', ['/T', '/F', '/PID', process.pid.toString()], options);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    else {
        process.kill('SIGKILL');
        return true;
    }
}
exports.terminate = terminate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY2Vzc2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Byb3RvY29sL3V0aWxzL3Byb2Nlc3Nlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRztBQUNILG9CQUFvQjtBQUNwQixJQUFZLEVBQUUsV0FBTSxlQUFlLENBQUMsQ0FBQTtBQUtwQyxJQUFNLFNBQVMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEtBQUssT0FBTyxDQUFDLENBQUM7QUFDakQsSUFBTSxXQUFXLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxLQUFLLFFBQVEsQ0FBQyxDQUFDO0FBQ3BELElBQU0sT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUMsQ0FBQztBQUMvQyxtQkFBMEIsT0FBcUIsRUFBRSxHQUFZO0lBQ3pELEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDWixJQUFJLENBQUM7WUFDRCxpREFBaUQ7WUFDakQsK0RBQStEO1lBQy9ELGlDQUFpQztZQUNqQyxJQUFJLE9BQU8sR0FBTztnQkFDZCxLQUFLLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQzthQUNwQyxDQUFDO1lBQ0YsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDTixPQUFPLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQTtZQUNyQixDQUFDO1lBQ0ssRUFBRyxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDMUYsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFFO1FBQUEsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDakIsQ0FBQztJQUNMLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNKLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0FBQ0wsQ0FBQztBQXJCZSxpQkFBUyxZQXFCeEIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiAgQGxpY2Vuc2UgICBNSVRcclxuICogIEBjb3B5cmlnaHQgT21uaVNoYXJwIFRlYW1cclxuICogIEBzdW1tYXJ5ICAgQWRkcyBzdXBwb3J0IGZvciBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L2xhbmd1YWdlLXNlcnZlci1wcm90b2NvbCAoYW5kIG1vcmUhKSB0byBodHRwczovL2F0b20uaW9cclxuICovXHJcbi8qIHRzbGludDpkaXNhYmxlICovXHJcbmltcG9ydCAqIGFzIGNwIGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xyXG5pbXBvcnQgQ2hpbGRQcm9jZXNzID0gY3AuQ2hpbGRQcm9jZXNzO1xyXG5cclxuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xyXG5cclxuY29uc3QgaXNXaW5kb3dzID0gKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicpO1xyXG5jb25zdCBpc01hY2ludG9zaCA9IChwcm9jZXNzLnBsYXRmb3JtID09PSAnZGFyd2luJyk7XHJcbmNvbnN0IGlzTGludXggPSAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2xpbnV4Jyk7XHJcbmV4cG9ydCBmdW5jdGlvbiB0ZXJtaW5hdGUocHJvY2VzczogQ2hpbGRQcm9jZXNzLCBjd2Q/OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgIGlmIChpc1dpbmRvd3MpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvLyBUaGlzIHdlIHJ1biBpbiBBdG9tIGV4ZWNGaWxlU3luYyBpcyBhdmFpbGFibGUuXHJcbiAgICAgICAgICAgIC8vIElnbm9yZSBzdGRlcnIgc2luY2UgdGhpcyBpcyBvdGhlcndpc2UgcGlwZWQgdG8gcGFyZW50LnN0ZGVyclxyXG4gICAgICAgICAgICAvLyB3aGljaCBtaWdodCBiZSBhbHJlYWR5IGNsb3NlZC5cclxuICAgICAgICAgICAgbGV0IG9wdGlvbnM6YW55ID0ge1xyXG4gICAgICAgICAgICAgICAgc3RkaW86IFsncGlwZScsICdwaXBlJywgJ2lnbm9yZSddXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGlmIChjd2QpIHtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMuY3dkID0gY3dkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKDxhbnk+Y3ApLmV4ZWNGaWxlU3luYygndGFza2tpbGwnLCBbJy9UJywgJy9GJywgJy9QSUQnLCBwcm9jZXNzLnBpZC50b1N0cmluZygpXSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBwcm9jZXNzLmtpbGwoJ1NJR0tJTEwnKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG4iXX0=