"use strict";
/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
function _encode(ch) {
    return '%' + ch.charCodeAt(0).toString(16).toUpperCase();
}
// see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
function encodeURIComponent2(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, _encode);
}
function encodeNoop(str) {
    return str;
}
/**
 * Uniform Resource Identifier (URI) http://tools.ietf.org/html/rfc3986.
 * This class is a simple parser which creates the basic component paths
 * (http://tools.ietf.org/html/rfc3986#section-3) with minimal validation
 * and encoding.
 *
 *       foo://example.com:8042/over/there?name=ferret#nose
 *       \_/   \______________/\_________/ \_________/ \__/
 *        |           |            |            |        |
 *     scheme     authority       path        query   fragment
 *        |   _____________________|__
 *       / \ /                        \
 *       urn:example:animal:ferret:nose
 *
 *
 */
var URI = (function () {
    function URI() {
        this._scheme = URI._empty;
        this._authority = URI._empty;
        this._path = URI._empty;
        this._query = URI._empty;
        this._fragment = URI._empty;
        this._formatted = null;
        this._fsPath = null;
    }
    Object.defineProperty(URI.prototype, "scheme", {
        /**
         * scheme is the 'http' part of 'http://www.msft.com/some/path?query#fragment'.
         * The part before the first colon.
         */
        get: function () {
            return this._scheme;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(URI.prototype, "authority", {
        /**
         * authority is the 'www.msft.com' part of 'http://www.msft.com/some/path?query#fragment'.
         * The part between the first double slashes and the next slash.
         */
        get: function () {
            return this._authority;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(URI.prototype, "path", {
        /**
         * path is the '/some/path' part of 'http://www.msft.com/some/path?query#fragment'.
         */
        get: function () {
            return this._path;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(URI.prototype, "query", {
        /**
         * query is the 'query' part of 'http://www.msft.com/some/path?query#fragment'.
         */
        get: function () {
            return this._query;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(URI.prototype, "fragment", {
        /**
         * fragment is the 'fragment' part of 'http://www.msft.com/some/path?query#fragment'.
         */
        get: function () {
            return this._fragment;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(URI.prototype, "fsPath", {
        // ---- filesystem path -----------------------
        /**
         * Returns a string representing the corresponding file system path of this URI.
         * Will handle UNC paths and normalize windows drive letters to lower-case. Also
         * uses the platform specific path separator. Will *not* validate the path for
         * invalid characters and semantics. Will *not* look at the scheme of this URI.
         */
        get: function () {
            if (!this._fsPath) {
                var value = void 0;
                if (this._authority && this.scheme === 'file') {
                    // unc path: file://shares/c$/far/boo
                    value = "//" + this._authority + this._path;
                }
                else if (URI._driveLetterPath.test(this._path)) {
                    // windows drive letter: file:///c:/far/boo
                    value = this._path[1].toLowerCase() + this._path.substr(2);
                }
                else {
                    // other path
                    value = this._path;
                }
                if (process.platform === 'win32') {
                    value = value.replace(/\//g, '\\');
                }
                this._fsPath = value;
            }
            return this._fsPath;
        },
        enumerable: true,
        configurable: true
    });
    // ---- modify to new -------------------------
    URI.prototype.with = function (scheme, authority, path, query, fragment) {
        var ret = new URI();
        ret._scheme = scheme || this.scheme;
        ret._authority = authority || this.authority;
        ret._path = path || this.path;
        ret._query = query || this.query;
        ret._fragment = fragment || this.fragment;
        URI._validate(ret);
        return ret;
    };
    URI.prototype.withScheme = function (value) {
        return this.with(value, undefined, undefined, undefined, undefined);
    };
    URI.prototype.withAuthority = function (value) {
        return this.with(undefined, value, undefined, undefined, undefined);
    };
    URI.prototype.withPath = function (value) {
        return this.with(undefined, undefined, value, undefined, undefined);
    };
    URI.prototype.withQuery = function (value) {
        return this.with(undefined, undefined, undefined, value, undefined);
    };
    URI.prototype.withFragment = function (value) {
        return this.with(undefined, undefined, undefined, undefined, value);
    };
    // ---- parse & validate ------------------------
    URI.parse = function (value) {
        var ret = new URI();
        var data = URI._parseComponents(value);
        ret._scheme = data.scheme;
        ret._authority = decodeURIComponent(data.authority);
        ret._path = decodeURIComponent(data.path);
        ret._query = decodeURIComponent(data.query);
        ret._fragment = decodeURIComponent(data.fragment);
        URI._validate(ret);
        return ret;
    };
    URI.file = function (path) {
        var ret = new URI();
        ret._scheme = 'file';
        // normalize to fwd-slashes
        path = path.replace(/\\/g, URI._slash);
        // check for authority as used in UNC shares
        // or use the path as given
        if (path[0] === URI._slash && path[0] === path[1]) {
            var idx = path.indexOf(URI._slash, 2);
            if (idx === -1) {
                ret._authority = path.substring(2);
            }
            else {
                ret._authority = path.substring(2, idx);
                ret._path = path.substring(idx);
            }
        }
        else {
            ret._path = path;
        }
        // Ensure that path starts with a slash
        // or that it is at least a slash
        if (ret._path[0] !== URI._slash) {
            ret._path = URI._slash + ret._path;
        }
        URI._validate(ret);
        return ret;
    };
    URI._parseComponents = function (value) {
        var ret = {
            scheme: URI._empty,
            authority: URI._empty,
            path: URI._empty,
            query: URI._empty,
            fragment: URI._empty,
        };
        var match = URI._regexp.exec(value);
        if (match) {
            ret.scheme = match[2] || ret.scheme;
            ret.authority = match[4] || ret.authority;
            ret.path = match[5] || ret.path;
            ret.query = match[7] || ret.query;
            ret.fragment = match[9] || ret.fragment;
        }
        return ret;
    };
    URI.create = function (scheme, authority, path, query, fragment) {
        return new URI().with(scheme, authority, path, query, fragment);
    };
    URI._validate = function (ret) {
        // validation
        // path, http://tools.ietf.org/html/rfc3986#section-3.3
        // If a URI contains an authority component, then the path component
        // must either be empty or begin with a slash ("/") character.  If a URI
        // does not contain an authority component, then the path cannot begin
        // with two slash characters ("//").
        if (ret.authority && ret.path && ret.path[0] !== '/') {
            throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character');
        }
        if (!ret.authority && ret.path.indexOf('//') === 0) {
            throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")');
        }
    };
    // ---- printing/externalize ---------------------------
    /**
     *
     * @param skipEncoding Do not encode the result, default is `false`
     */
    URI.prototype.toString = function (skipEncoding) {
        if (skipEncoding === void 0) { skipEncoding = false; }
        if (!skipEncoding) {
            if (!this._formatted) {
                this._formatted = URI._asFormatted(this, false);
            }
            return this._formatted;
        }
        else {
            // we don't cache that
            return URI._asFormatted(this, true);
        }
    };
    URI._asFormatted = function (uri, skipEncoding) {
        var encoder = !skipEncoding
            ? encodeURIComponent2
            : encodeNoop;
        var parts = [];
        var scheme = uri.scheme, authority = uri.authority, path = uri.path, query = uri.query, fragment = uri.fragment;
        if (scheme) {
            parts.push(scheme, ':');
        }
        if (authority || scheme === 'file') {
            parts.push('//');
        }
        if (authority) {
            authority = authority.toLowerCase();
            var idx = authority.indexOf(':');
            if (idx === -1) {
                parts.push(encoder(authority));
            }
            else {
                parts.push(encoder(authority.substr(0, idx)), authority.substr(idx));
            }
        }
        if (path) {
            // lower-case windown drive letters in /C:/fff
            var m = URI._upperCaseDrive.exec(path);
            if (m) {
                path = m[1] + m[2].toLowerCase() + path.substr(m[1].length + m[2].length);
            }
            // encode every segement but not slashes
            // make sure that # and ? are always encoded
            // when occurring in paths - otherwise the result
            // cannot be parsed back again
            var lastIdx = 0;
            while (true) {
                var idx = path.indexOf(URI._slash, lastIdx);
                if (idx === -1) {
                    parts.push(encoder(path.substring(lastIdx)).replace(/[#?]/, _encode));
                    break;
                }
                parts.push(encoder(path.substring(lastIdx, idx)).replace(/[#?]/, _encode), URI._slash);
                lastIdx = idx + 1;
            }
            ;
        }
        if (query) {
            parts.push('?', encoder(query));
        }
        if (fragment) {
            parts.push('#', encoder(fragment));
        }
        return parts.join(URI._empty);
    };
    URI.prototype.toJSON = function () {
        return {
            scheme: this.scheme,
            authority: this.authority,
            path: this.path,
            fsPath: this.fsPath,
            query: this.query,
            fragment: this.fragment,
            external: this.toString(),
            $mid: 1
        };
    };
    URI._empty = '';
    URI._slash = '/';
    URI._regexp = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
    URI._driveLetterPath = /^\/[a-zA-z]:/;
    URI._upperCaseDrive = /^(\/)?([A-Z]:)/;
    return URI;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = URI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGx1Z2lucy9hdG9tLWxhbmd1YWdlLWpzb24vc2VydmVyL3V0aWxzL3VyaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRztBQUNILGlCQUFpQixFQUFVO0lBQ3ZCLE1BQU0sQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDN0QsQ0FBQztBQUVELDBHQUEwRztBQUMxRyw2QkFBNkIsR0FBVztJQUNwQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNoRSxDQUFDO0FBRUQsb0JBQW9CLEdBQVc7SUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUNmLENBQUM7QUFHRDs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSDtJQWdCSTtRQUNJLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUMxQixJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDN0IsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFFNUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDeEIsQ0FBQztJQU1ELHNCQUFJLHVCQUFNO1FBSlY7OztXQUdHO2FBQ0g7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN4QixDQUFDOzs7T0FBQTtJQU1ELHNC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Q0FBQztJQUN6RSxvQkFBZ0IsR0FBRyxjQUFjLENBQUM7SUFDbEMsbUJBQWUsR0FBRyxnQkFBZ0IsQ0FBQztJQXNTdEQsVUFBQztBQUFELENBQUMsQUE1U0QsSUE0U0M7QUE1U0Q7cUJBNFNDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqICBAbGljZW5zZSAgIE1JVFxuICogIEBjb3B5cmlnaHQgT21uaVNoYXJwIFRlYW1cbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXG4gKi9cbmZ1bmN0aW9uIF9lbmNvZGUoY2g6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuICclJyArIGNoLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7XG59XG5cbi8vIHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9lbmNvZGVVUklDb21wb25lbnRcbmZ1bmN0aW9uIGVuY29kZVVSSUNvbXBvbmVudDIoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoc3RyKS5yZXBsYWNlKC9bIScoKSpdL2csIF9lbmNvZGUpO1xufVxuXG5mdW5jdGlvbiBlbmNvZGVOb29wKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gc3RyO1xufVxuXG5cbi8qKlxuICogVW5pZm9ybSBSZXNvdXJjZSBJZGVudGlmaWVyIChVUkkpIGh0dHA6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM5ODYuXG4gKiBUaGlzIGNsYXNzIGlzIGEgc2ltcGxlIHBhcnNlciB3aGljaCBjcmVhdGVzIHRoZSBiYXNpYyBjb21wb25lbnQgcGF0aHNcbiAqIChodHRwOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzOTg2I3NlY3Rpb24tMykgd2l0aCBtaW5pbWFsIHZhbGlkYXRpb25cbiAqIGFuZCBlbmNvZGluZy5cbiAqXG4gKiAgICAgICBmb286Ly9leGFtcGxlLmNvbTo4MDQyL292ZXIvdGhlcmU/bmFtZT1mZXJyZXQjbm9zZVxuICogICAgICAgXFxfLyAgIFxcX19fX19fX19fX19fX18vXFxfX19fX19fX18vIFxcX19fX19fX19fLyBcXF9fL1xuICogICAgICAgIHwgICAgICAgICAgIHwgICAgICAgICAgICB8ICAgICAgICAgICAgfCAgICAgICAgfFxuICogICAgIHNjaGVtZSAgICAgYXV0aG9yaXR5ICAgICAgIHBhdGggICAgICAgIHF1ZXJ5ICAgZnJhZ21lbnRcbiAqICAgICAgICB8ICAgX19fX19fX19fX19fX19fX19fX19ffF9fXG4gKiAgICAgICAvIFxcIC8gICAgICAgICAgICAgICAgICAgICAgICBcXFxuICogICAgICAgdXJuOmV4YW1wbGU6YW5pbWFsOmZlcnJldDpub3NlXG4gKlxuICpcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVVJJIHtcblxuICAgIHByaXZhdGUgc3RhdGljIF9lbXB0eSA9ICcnO1xuICAgIHByaXZhdGUgc3RhdGljIF9zbGFzaCA9ICcvJztcbiAgICBwcml2YXRlIHN0YXRpYyBfcmVnZXhwID0gL14oKFteOi8/I10rPyk6KT8oXFwvXFwvKFteLz8jXSopKT8oW14/I10qKShcXD8oW14jXSopKT8oIyguKikpPy87XG4gICAgcHJpdmF0ZSBzdGF0aWMgX2RyaXZlTGV0dGVyUGF0aCA9IC9eXFwvW2EtekEtel06LztcbiAgICBwcml2YXRlIHN0YXRpYyBfdXBwZXJDYXNlRHJpdmUgPSAvXihcXC8pPyhbQS1aXTopLztcblxuICAgIHByaXZhdGUgX3NjaGVtZTogc3RyaW5nO1xuICAgIHByaXZhdGUgX2F1dGhvcml0eTogc3RyaW5nO1xuICAgIHByaXZhdGUgX3BhdGg6IHN0cmluZztcbiAgICBwcml2YXRlIF9xdWVyeTogc3RyaW5nO1xuICAgIHByaXZhdGUgX2ZyYWdtZW50OiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfZm9ybWF0dGVkOiBzdHJpbmcgfCBudWxsO1xuICAgIHByaXZhdGUgX2ZzUGF0aDogc3RyaW5nIHwgbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl9zY2hlbWUgPSBVUkkuX2VtcHR5O1xuICAgICAgICB0aGlzLl9hdXRob3JpdHkgPSBVUkkuX2VtcHR5O1xuICAgICAgICB0aGlzLl9wYXRoID0gVVJJLl9lbXB0eTtcbiAgICAgICAgdGhpcy5fcXVlcnkgPSBVUkkuX2VtcHR5O1xuICAgICAgICB0aGlzLl9mcmFnbWVudCA9IFVSSS5fZW1wdHk7XG5cbiAgICAgICAgdGhpcy5fZm9ybWF0dGVkID0gbnVsbDtcbiAgICAgICAgdGhpcy5fZnNQYXRoID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzY2hlbWUgaXMgdGhlICdodHRwJyBwYXJ0IG9mICdodHRwOi8vd3d3Lm1zZnQuY29tL3NvbWUvcGF0aD9xdWVyeSNmcmFnbWVudCcuXG4gICAgICogVGhlIHBhcnQgYmVmb3JlIHRoZSBmaXJzdCBjb2xvbi5cbiAgICAgKi9cbiAgICBnZXQgc2NoZW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2NoZW1lO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGF1dGhvcml0eSBpcyB0aGUgJ3d3dy5tc2Z0LmNvbScgcGFydCBvZiAnaHR0cDovL3d3dy5tc2Z0LmNvbS9zb21lL3BhdGg/cXVlcnkjZnJhZ21lbnQnLlxuICAgICAqIFRoZSBwYXJ0IGJldHdlZW4gdGhlIGZpcnN0IGRvdWJsZSBzbGFzaGVzIGFuZCB0aGUgbmV4dCBzbGFzaC5cbiAgICAgKi9cbiAgICBnZXQgYXV0aG9yaXR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXV0aG9yaXR5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHBhdGggaXMgdGhlICcvc29tZS9wYXRoJyBwYXJ0IG9mICdodHRwOi8vd3d3Lm1zZnQuY29tL3NvbWUvcGF0aD9xdWVyeSNmcmFnbWVudCcuXG4gICAgICovXG4gICAgZ2V0IHBhdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXRoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHF1ZXJ5IGlzIHRoZSAncXVlcnknIHBhcnQgb2YgJ2h0dHA6Ly93d3cubXNmdC5jb20vc29tZS9wYXRoP3F1ZXJ5I2ZyYWdtZW50Jy5cbiAgICAgKi9cbiAgICBnZXQgcXVlcnkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9xdWVyeTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBmcmFnbWVudCBpcyB0aGUgJ2ZyYWdtZW50JyBwYXJ0IG9mICdodHRwOi8vd3d3Lm1zZnQuY29tL3NvbWUvcGF0aD9xdWVyeSNmcmFnbWVudCcuXG4gICAgICovXG4gICAgZ2V0IGZyYWdtZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZnJhZ21lbnQ7XG4gICAgfVxuXG4gICAgLy8gLS0tLSBmaWxlc3lzdGVtIHBhdGggLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBjb3JyZXNwb25kaW5nIGZpbGUgc3lzdGVtIHBhdGggb2YgdGhpcyBVUkkuXG4gICAgICogV2lsbCBoYW5kbGUgVU5DIHBhdGhzIGFuZCBub3JtYWxpemUgd2luZG93cyBkcml2ZSBsZXR0ZXJzIHRvIGxvd2VyLWNhc2UuIEFsc29cbiAgICAgKiB1c2VzIHRoZSBwbGF0Zm9ybSBzcGVjaWZpYyBwYXRoIHNlcGFyYXRvci4gV2lsbCAqbm90KiB2YWxpZGF0ZSB0aGUgcGF0aCBmb3JcbiAgICAgKiBpbnZhbGlkIGNoYXJhY3RlcnMgYW5kIHNlbWFudGljcy4gV2lsbCAqbm90KiBsb29rIGF0IHRoZSBzY2hlbWUgb2YgdGhpcyBVUkkuXG4gICAgICovXG4gICAgZ2V0IGZzUGF0aCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9mc1BhdGgpIHtcbiAgICAgICAgICAgIGxldCB2YWx1ZTogc3RyaW5nO1xuICAgICAgICAgICAgaWYgKHRoaXMuX2F1dGhvcml0eSAmJiB0aGlzLnNjaGVtZSA9PT0gJ2ZpbGUnKSB7XG4gICAgICAgICAgICAgICAgLy8gdW5jIHBhdGg6IGZpbGU6Ly9zaGFyZXMvYyQvZmFyL2Jvb1xuICAgICAgICAgICAgICAgIHZhbHVlID0gYC8vJHt0aGlzLl9hdXRob3JpdHl9JHt0aGlzLl9wYXRofWA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFVSSS5fZHJpdmVMZXR0ZXJQYXRoLnRlc3QodGhpcy5fcGF0aCkpIHtcbiAgICAgICAgICAgICAgICAvLyB3aW5kb3dzIGRyaXZlIGxldHRlcjogZmlsZTovLy9jOi9mYXIvYm9vXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLl9wYXRoWzFdLnRvTG93ZXJDYXNlKCkgKyB0aGlzLl9wYXRoLnN1YnN0cigyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gb3RoZXIgcGF0aFxuICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5fcGF0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXC8vZywgJ1xcXFwnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2ZzUGF0aCA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9mc1BhdGg7XG4gICAgfVxuXG4gICAgLy8gLS0tLSBtb2RpZnkgdG8gbmV3IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIHB1YmxpYyB3aXRoKHNjaGVtZTogc3RyaW5nIHwgdW5kZWZpbmVkLCBhdXRob3JpdHk6IHN0cmluZ3wgdW5kZWZpbmVkLCBwYXRoOiBzdHJpbmd8IHVuZGVmaW5lZCwgcXVlcnk6IHN0cmluZ3wgdW5kZWZpbmVkLCBmcmFnbWVudDogc3RyaW5nfCB1bmRlZmluZWQpOiBVUkkge1xuICAgICAgICBjb25zdCByZXQgPSBuZXcgVVJJKCk7XG4gICAgICAgIHJldC5fc2NoZW1lID0gc2NoZW1lIHx8IHRoaXMuc2NoZW1lO1xuICAgICAgICByZXQuX2F1dGhvcml0eSA9IGF1dGhvcml0eSB8fCB0aGlzLmF1dGhvcml0eTtcbiAgICAgICAgcmV0Ll9wYXRoID0gcGF0aCB8fCB0aGlzLnBhdGg7XG4gICAgICAgIHJldC5fcXVlcnkgPSBxdWVyeSB8fCB0aGlzLnF1ZXJ5O1xuICAgICAgICByZXQuX2ZyYWdtZW50ID0gZnJhZ21lbnQgfHwgdGhpcy5mcmFnbWVudDtcbiAgICAgICAgVVJJLl92YWxpZGF0ZShyZXQpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHB1YmxpYyB3aXRoU2NoZW1lKHZhbHVlOiBzdHJpbmcpOiBVUkkge1xuICAgICAgICByZXR1cm4gdGhpcy53aXRoKHZhbHVlLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB3aXRoQXV0aG9yaXR5KHZhbHVlOiBzdHJpbmcpOiBVUkkge1xuICAgICAgICByZXR1cm4gdGhpcy53aXRoKHVuZGVmaW5lZCwgdmFsdWUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB3aXRoUGF0aCh2YWx1ZTogc3RyaW5nKTogVVJJIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2l0aCh1bmRlZmluZWQsIHVuZGVmaW5lZCwgdmFsdWUsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgd2l0aFF1ZXJ5KHZhbHVlOiBzdHJpbmcpOiBVUkkge1xuICAgICAgICByZXR1cm4gdGhpcy53aXRoKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHZhbHVlLCB1bmRlZmluZWQpO1xuICAgIH1cblxuICAgIHB1YmxpYyB3aXRoRnJhZ21lbnQodmFsdWU6IHN0cmluZyk6IFVSSSB7XG4gICAgICAgIHJldHVybiB0aGlzLndpdGgodW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gLS0tLSBwYXJzZSAmIHZhbGlkYXRlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgcHVibGljIHN0YXRpYyBwYXJzZSh2YWx1ZTogc3RyaW5nKTogVVJJIHtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IFVSSSgpO1xuICAgICAgICBjb25zdCBkYXRhID0gVVJJLl9wYXJzZUNvbXBvbmVudHModmFsdWUpO1xuICAgICAgICByZXQuX3NjaGVtZSA9IGRhdGEuc2NoZW1lO1xuICAgICAgICByZXQuX2F1dGhvcml0eSA9IGRlY29kZVVSSUNvbXBvbmVudChkYXRhLmF1dGhvcml0eSk7XG4gICAgICAgIHJldC5fcGF0aCA9IGRlY29kZVVSSUNvbXBvbmVudChkYXRhLnBhdGgpO1xuICAgICAgICByZXQuX3F1ZXJ5ID0gZGVjb2RlVVJJQ29tcG9uZW50KGRhdGEucXVlcnkpO1xuICAgICAgICByZXQuX2ZyYWdtZW50ID0gZGVjb2RlVVJJQ29tcG9uZW50KGRhdGEuZnJhZ21lbnQpO1xuICAgICAgICBVUkkuX3ZhbGlkYXRlKHJldCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBmaWxlKHBhdGg6IHN0cmluZyk6IFVSSSB7XG5cbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IFVSSSgpO1xuICAgICAgICByZXQuX3NjaGVtZSA9ICdmaWxlJztcblxuICAgICAgICAvLyBub3JtYWxpemUgdG8gZndkLXNsYXNoZXNcbiAgICAgICAgcGF0aCA9IHBhdGgucmVwbGFjZSgvXFxcXC9nLCBVUkkuX3NsYXNoKTtcblxuICAgICAgICAvLyBjaGVjayBmb3IgYXV0aG9yaXR5IGFzIHVzZWQgaW4gVU5DIHNoYXJlc1xuICAgICAgICAvLyBvciB1c2UgdGhlIHBhdGggYXMgZ2l2ZW5cbiAgICAgICAgaWYgKHBhdGhbMF0gPT09IFVSSS5fc2xhc2ggJiYgcGF0aFswXSA9PT0gcGF0aFsxXSkge1xuICAgICAgICAgICAgbGV0IGlkeCA9IHBhdGguaW5kZXhPZihVUkkuX3NsYXNoLCAyKTtcbiAgICAgICAgICAgIGlmIChpZHggPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcmV0Ll9hdXRob3JpdHkgPSBwYXRoLnN1YnN0cmluZygyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0Ll9hdXRob3JpdHkgPSBwYXRoLnN1YnN0cmluZygyLCBpZHgpO1xuICAgICAgICAgICAgICAgIHJldC5fcGF0aCA9IHBhdGguc3Vic3RyaW5nKGlkeCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXQuX3BhdGggPSBwYXRoO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRW5zdXJlIHRoYXQgcGF0aCBzdGFydHMgd2l0aCBhIHNsYXNoXG4gICAgICAgIC8vIG9yIHRoYXQgaXQgaXMgYXQgbGVhc3QgYSBzbGFzaFxuICAgICAgICBpZiAocmV0Ll9wYXRoWzBdICE9PSBVUkkuX3NsYXNoKSB7XG4gICAgICAgICAgICByZXQuX3BhdGggPSBVUkkuX3NsYXNoICsgcmV0Ll9wYXRoO1xuICAgICAgICB9XG5cbiAgICAgICAgVVJJLl92YWxpZGF0ZShyZXQpO1xuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgX3BhcnNlQ29tcG9uZW50cyh2YWx1ZTogc3RyaW5nKTogVXJpQ29tcG9uZW50cyB7XG5cbiAgICAgICAgY29uc3QgcmV0OiBVcmlDb21wb25lbnRzID0ge1xuICAgICAgICAgICAgc2NoZW1lOiBVUkkuX2VtcHR5LFxuICAgICAgICAgICAgYXV0aG9yaXR5OiBVUkkuX2VtcHR5LFxuICAgICAgICAgICAgcGF0aDogVVJJLl9lbXB0eSxcbiAgICAgICAgICAgIHF1ZXJ5OiBVUkkuX2VtcHR5LFxuICAgICAgICAgICAgZnJhZ21lbnQ6IFVSSS5fZW1wdHksXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgbWF0Y2ggPSBVUkkuX3JlZ2V4cC5leGVjKHZhbHVlKTtcbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICByZXQuc2NoZW1lID0gbWF0Y2hbMl0gfHwgcmV0LnNjaGVtZTtcbiAgICAgICAgICAgIHJldC5hdXRob3JpdHkgPSBtYXRjaFs0XSB8fCByZXQuYXV0aG9yaXR5O1xuICAgICAgICAgICAgcmV0LnBhdGggPSBtYXRjaFs1XSB8fCByZXQucGF0aDtcbiAgICAgICAgICAgIHJldC5xdWVyeSA9IG1hdGNoWzddIHx8IHJldC5xdWVyeTtcbiAgICAgICAgICAgIHJldC5mcmFnbWVudCA9IG1hdGNoWzldIHx8IHJldC5mcmFnbWVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlKHNjaGVtZT86IHN0cmluZywgYXV0aG9yaXR5Pzogc3RyaW5nLCBwYXRoPzogc3RyaW5nLCBxdWVyeT86IHN0cmluZywgZnJhZ21lbnQ/OiBzdHJpbmcpOiBVUkkge1xuICAgICAgICByZXR1cm4gbmV3IFVSSSgpLndpdGgoc2NoZW1lLCBhdXRob3JpdHksIHBhdGgsIHF1ZXJ5LCBmcmFnbWVudCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgX3ZhbGlkYXRlKHJldDogVVJJKTogdm9pZCB7XG5cbiAgICAgICAgLy8gdmFsaWRhdGlvblxuICAgICAgICAvLyBwYXRoLCBodHRwOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzOTg2I3NlY3Rpb24tMy4zXG4gICAgICAgIC8vIElmIGEgVVJJIGNvbnRhaW5zIGFuIGF1dGhvcml0eSBjb21wb25lbnQsIHRoZW4gdGhlIHBhdGggY29tcG9uZW50XG4gICAgICAgIC8vIG11c3QgZWl0aGVyIGJlIGVtcHR5IG9yIGJlZ2luIHdpdGggYSBzbGFzaCAoXCIvXCIpIGNoYXJhY3Rlci4gIElmIGEgVVJJXG4gICAgICAgIC8vIGRvZXMgbm90IGNvbnRhaW4gYW4gYXV0aG9yaXR5IGNvbXBvbmVudCwgdGhlbiB0aGUgcGF0aCBjYW5ub3QgYmVnaW5cbiAgICAgICAgLy8gd2l0aCB0d28gc2xhc2ggY2hhcmFjdGVycyAoXCIvL1wiKS5cbiAgICAgICAgaWYgKHJldC5hdXRob3JpdHkgJiYgcmV0LnBhdGggJiYgcmV0LnBhdGhbMF0gIT09ICcvJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdbVXJpRXJyb3JdOiBJZiBhIFVSSSBjb250YWlucyBhbiBhdXRob3JpdHkgY29tcG9uZW50LCB0aGVuIHRoZSBwYXRoIGNvbXBvbmVudCBtdXN0IGVpdGhlciBiZSBlbXB0eSBvciBiZWdpbiB3aXRoIGEgc2xhc2ggKFwiL1wiKSBjaGFyYWN0ZXInKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXJldC5hdXRob3JpdHkgJiYgcmV0LnBhdGguaW5kZXhPZignLy8nKSA9PT0gMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdbVXJpRXJyb3JdOiBJZiBhIFVSSSBkb2VzIG5vdCBjb250YWluIGFuIGF1dGhvcml0eSBjb21wb25lbnQsIHRoZW4gdGhlIHBhdGggY2Fubm90IGJlZ2luIHdpdGggdHdvIHNsYXNoIGNoYXJhY3RlcnMgKFwiLy9cIiknKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIC0tLS0gcHJpbnRpbmcvZXh0ZXJuYWxpemUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBza2lwRW5jb2RpbmcgRG8gbm90IGVuY29kZSB0aGUgcmVzdWx0LCBkZWZhdWx0IGlzIGBmYWxzZWBcbiAgICAgKi9cbiAgICBwdWJsaWMgdG9TdHJpbmcoc2tpcEVuY29kaW5nOiBib29sZWFuID0gZmFsc2UpOiBzdHJpbmcge1xuICAgICAgICBpZiAoIXNraXBFbmNvZGluZykge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9mb3JtYXR0ZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JtYXR0ZWQgPSBVUkkuX2FzRm9ybWF0dGVkKHRoaXMsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb3JtYXR0ZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB3ZSBkb24ndCBjYWNoZSB0aGF0XG4gICAgICAgICAgICByZXR1cm4gVVJJLl9hc0Zvcm1hdHRlZCh0aGlzLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIF9hc0Zvcm1hdHRlZCh1cmk6IFVSSSwgc2tpcEVuY29kaW5nOiBib29sZWFuKTogc3RyaW5nIHtcblxuICAgICAgICBjb25zdCBlbmNvZGVyID0gIXNraXBFbmNvZGluZ1xuICAgICAgICAgICAgPyBlbmNvZGVVUklDb21wb25lbnQyXG4gICAgICAgICAgICA6IGVuY29kZU5vb3A7XG5cbiAgICAgICAgY29uc3QgcGFydHM6IHN0cmluZ1tdID0gW107XG5cbiAgICAgICAgbGV0IHtzY2hlbWUsIGF1dGhvcml0eSwgcGF0aCwgcXVlcnksIGZyYWdtZW50fSA9IHVyaTtcbiAgICAgICAgaWYgKHNjaGVtZSkge1xuICAgICAgICAgICAgcGFydHMucHVzaChzY2hlbWUsICc6Jyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGF1dGhvcml0eSB8fCBzY2hlbWUgPT09ICdmaWxlJykge1xuICAgICAgICAgICAgcGFydHMucHVzaCgnLy8nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXV0aG9yaXR5KSB7XG4gICAgICAgICAgICBhdXRob3JpdHkgPSBhdXRob3JpdHkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGxldCBpZHggPSBhdXRob3JpdHkuaW5kZXhPZignOicpO1xuICAgICAgICAgICAgaWYgKGlkeCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBwYXJ0cy5wdXNoKGVuY29kZXIoYXV0aG9yaXR5KSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBhcnRzLnB1c2goZW5jb2RlcihhdXRob3JpdHkuc3Vic3RyKDAsIGlkeCkpLCBhdXRob3JpdHkuc3Vic3RyKGlkeCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChwYXRoKSB7XG4gICAgICAgICAgICAvLyBsb3dlci1jYXNlIHdpbmRvd24gZHJpdmUgbGV0dGVycyBpbiAvQzovZmZmXG4gICAgICAgICAgICBjb25zdCBtID0gVVJJLl91cHBlckNhc2VEcml2ZS5leGVjKHBhdGgpO1xuICAgICAgICAgICAgaWYgKG0pIHtcbiAgICAgICAgICAgICAgICBwYXRoID0gbVsxXSArIG1bMl0udG9Mb3dlckNhc2UoKSArIHBhdGguc3Vic3RyKG1bMV0ubGVuZ3RoICsgbVsyXS5sZW5ndGgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBlbmNvZGUgZXZlcnkgc2VnZW1lbnQgYnV0IG5vdCBzbGFzaGVzXG4gICAgICAgICAgICAvLyBtYWtlIHN1cmUgdGhhdCAjIGFuZCA/IGFyZSBhbHdheXMgZW5jb2RlZFxuICAgICAgICAgICAgLy8gd2hlbiBvY2N1cnJpbmcgaW4gcGF0aHMgLSBvdGhlcndpc2UgdGhlIHJlc3VsdFxuICAgICAgICAgICAgLy8gY2Fubm90IGJlIHBhcnNlZCBiYWNrIGFnYWluXG4gICAgICAgICAgICBsZXQgbGFzdElkeCA9IDA7XG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgIGxldCBpZHggPSBwYXRoLmluZGV4T2YoVVJJLl9zbGFzaCwgbGFzdElkeCk7XG4gICAgICAgICAgICAgICAgaWYgKGlkeCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFydHMucHVzaChlbmNvZGVyKHBhdGguc3Vic3RyaW5nKGxhc3RJZHgpKS5yZXBsYWNlKC9bIz9dLywgX2VuY29kZSkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGFydHMucHVzaChlbmNvZGVyKHBhdGguc3Vic3RyaW5nKGxhc3RJZHgsIGlkeCkpLnJlcGxhY2UoL1sjP10vLCBfZW5jb2RlKSwgVVJJLl9zbGFzaCk7XG4gICAgICAgICAgICAgICAgbGFzdElkeCA9IGlkeCArIDE7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChxdWVyeSkge1xuICAgICAgICAgICAgcGFydHMucHVzaCgnPycsIGVuY29kZXIocXVlcnkpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZnJhZ21lbnQpIHtcbiAgICAgICAgICAgIHBhcnRzLnB1c2goJyMnLCBlbmNvZGVyKGZyYWdtZW50KSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGFydHMuam9pbihVUkkuX2VtcHR5KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9KU09OKCk6IGFueSB7XG4gICAgICAgIHJldHVybiA8VXJpU3RhdGU+e1xuICAgICAgICAgICAgc2NoZW1lOiB0aGlzLnNjaGVtZSxcbiAgICAgICAgICAgIGF1dGhvcml0eTogdGhpcy5hdXRob3JpdHksXG4gICAgICAgICAgICBwYXRoOiB0aGlzLnBhdGgsXG4gICAgICAgICAgICBmc1BhdGg6IHRoaXMuZnNQYXRoLFxuICAgICAgICAgICAgcXVlcnk6IHRoaXMucXVlcnksXG4gICAgICAgICAgICBmcmFnbWVudDogdGhpcy5mcmFnbWVudCxcbiAgICAgICAgICAgIGV4dGVybmFsOiB0aGlzLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAkbWlkOiAxXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5pbnRlcmZhY2UgVXJpQ29tcG9uZW50cyB7XG4gICAgc2NoZW1lOiBzdHJpbmc7XG4gICAgYXV0aG9yaXR5OiBzdHJpbmc7XG4gICAgcGF0aDogc3RyaW5nO1xuICAgIHF1ZXJ5OiBzdHJpbmc7XG4gICAgZnJhZ21lbnQ6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIFVyaVN0YXRlIGV4dGVuZHMgVXJpQ29tcG9uZW50cyB7XG4gICAgJG1pZDogbnVtYmVyO1xuICAgIGZzUGF0aDogc3RyaW5nO1xuICAgIGV4dGVybmFsOiBzdHJpbmc7XG59XG4iXX0=