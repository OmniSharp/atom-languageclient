"use strict";
/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
function convertSimple2RegExpPattern(pattern) {
    return pattern.replace(/[\-\\\{\}\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, '\\$&').replace(/[\*]/g, '.*');
}
exports.convertSimple2RegExpPattern = convertSimple2RegExpPattern;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BsdWdpbnMvYXRvbS1sYW5ndWFnZS1qc29uL3NlcnZlci91dGlscy9zdHJpbmdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHO0FBQ0gscUNBQTRDLE9BQWU7SUFDdkQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsdUNBQXVDLEVBQUUsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNuRyxDQUFDO0FBRmUsbUNBQTJCLDhCQUUxQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiAgQGxpY2Vuc2UgICBNSVRcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xuICovXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFNpbXBsZTJSZWdFeHBQYXR0ZXJuKHBhdHRlcm46IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHBhdHRlcm4ucmVwbGFjZSgvW1xcLVxcXFxcXHtcXH1cXCtcXD9cXHxcXF5cXCRcXC5cXCxcXFtcXF1cXChcXClcXCNcXHNdL2csICdcXFxcJCYnKS5yZXBsYWNlKC9bXFwqXS9nLCAnLionKTtcbn1cbiJdfQ==