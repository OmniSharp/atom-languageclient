"use strict";
/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol to atom
 */
require('./bootstrap');
var AtomLanguageClientPackage_1 = require('./AtomLanguageClientPackage');
module.exports = new AtomLanguageClientPackage_1.AtomLanguageClientPackage();
// const instance = (() => {
//     let i: any;
//     const ctor = require('./AtomLanguageClientPackage').AtomLanguageClientPackage;
//     return (() => {
//         if (!i) {
//             i = new ctor();
//         }
//         return i;
//     });
// })();
// const proxy = new Proxy({}, {
//     getPrototypeOf(target: any) {
//         return Object.getPrototypeOf(instance());
//     },
//     setPrototypeOf(target: any, v: any) {
//         return Object.setPrototypeOf(instance(), v);
//     },
//     isExtensible(target: any) {
//         return Object.isExtensible(instance());
//     },
//     preventExtensions(target: any) {
//         return Object.preventExtensions(instance());
//     },
//     getOwnPropertyDescriptor(target: any, p: PropertyKey) {
//         return Object.getOwnPropertyDescriptor(instance(), p);
//     },
//     has(target: any, p: PropertyKey) {
//         return p in instance();
//     },
//     get(target: any, p: PropertyKey, receiver: any) {
//         return instance()[p];
//     },
//     set(target: any, p: PropertyKey, value: any, receiver: any) {
//         return instance()[p] = value;
//     },
//     defineProperty(target: any, p: PropertyKey, attributes: PropertyDescriptor) {
//         return Object.defineProperty(instance(), p, attributes);
//     },
//     enumerate(target: any) {
//         return Object.keys(instance());
//     },
//     ownKeys(target: any) {
//         return Object.keys(instance());
//     }
// })
// module.exports = proxy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7QUFDSCxRQUFPLGFBQWEsQ0FBQyxDQUFBO0FBQ3JCLDBDQUEwQyw2QkFBNkIsQ0FBQyxDQUFBO0FBRXhFLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxxREFBeUIsRUFBRSxDQUFDO0FBRWpELDRCQUE0QjtBQUM1QixrQkFBa0I7QUFDbEIscUZBQXFGO0FBQ3JGLHNCQUFzQjtBQUN0QixvQkFBb0I7QUFDcEIsOEJBQThCO0FBQzlCLFlBQVk7QUFDWixvQkFBb0I7QUFDcEIsVUFBVTtBQUNWLFFBQVE7QUFFUixnQ0FBZ0M7QUFDaEMsb0NBQW9DO0FBQ3BDLG9EQUFvRDtBQUNwRCxTQUFTO0FBQ1QsNENBQTRDO0FBQzVDLHVEQUF1RDtBQUN2RCxTQUFTO0FBQ1Qsa0NBQWtDO0FBQ2xDLGtEQUFrRDtBQUNsRCxTQUFTO0FBQ1QsdUNBQXVDO0FBQ3ZDLHVEQUF1RDtBQUN2RCxTQUFTO0FBQ1QsOERBQThEO0FBQzlELGlFQUFpRTtBQUNqRSxTQUFTO0FBQ1QseUNBQXlDO0FBQ3pDLGtDQUFrQztBQUNsQyxTQUFTO0FBQ1Qsd0RBQXdEO0FBQ3hELGdDQUFnQztBQUNoQyxTQUFTO0FBQ1Qsb0VBQW9FO0FBQ3BFLHdDQUF3QztBQUN4QyxTQUFTO0FBQ1Qsb0ZBQW9GO0FBQ3BGLG1FQUFtRTtBQUNuRSxTQUFTO0FBQ1QsK0JBQStCO0FBQy9CLDBDQUEwQztBQUMxQyxTQUFTO0FBQ1QsNkJBQTZCO0FBQzdCLDBDQUEwQztBQUMxQyxRQUFRO0FBQ1IsS0FBSztBQUVMLDBCQUEwQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiAgQGxpY2Vuc2UgICBNSVRcclxuICogIEBjb3B5cmlnaHQgT21uaVNoYXJwIFRlYW1cclxuICogIEBzdW1tYXJ5ICAgQWRkcyBzdXBwb3J0IGZvciBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L2xhbmd1YWdlLXNlcnZlci1wcm90b2NvbCB0byBhdG9tXHJcbiAqL1xyXG5pbXBvcnQgJy4vYm9vdHN0cmFwJztcclxuaW1wb3J0IHsgQXRvbUxhbmd1YWdlQ2xpZW50UGFja2FnZSB9IGZyb20gJy4vQXRvbUxhbmd1YWdlQ2xpZW50UGFja2FnZSc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBBdG9tTGFuZ3VhZ2VDbGllbnRQYWNrYWdlKCk7XHJcblxyXG4vLyBjb25zdCBpbnN0YW5jZSA9ICgoKSA9PiB7XHJcbi8vICAgICBsZXQgaTogYW55O1xyXG4vLyAgICAgY29uc3QgY3RvciA9IHJlcXVpcmUoJy4vQXRvbUxhbmd1YWdlQ2xpZW50UGFja2FnZScpLkF0b21MYW5ndWFnZUNsaWVudFBhY2thZ2U7XHJcbi8vICAgICByZXR1cm4gKCgpID0+IHtcclxuLy8gICAgICAgICBpZiAoIWkpIHtcclxuLy8gICAgICAgICAgICAgaSA9IG5ldyBjdG9yKCk7XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgICAgIHJldHVybiBpO1xyXG4vLyAgICAgfSk7XHJcbi8vIH0pKCk7XHJcblxyXG4vLyBjb25zdCBwcm94eSA9IG5ldyBQcm94eSh7fSwge1xyXG4vLyAgICAgZ2V0UHJvdG90eXBlT2YodGFyZ2V0OiBhbnkpIHtcclxuLy8gICAgICAgICByZXR1cm4gT2JqZWN0LmdldFByb3RvdHlwZU9mKGluc3RhbmNlKCkpO1xyXG4vLyAgICAgfSxcclxuLy8gICAgIHNldFByb3RvdHlwZU9mKHRhcmdldDogYW55LCB2OiBhbnkpIHtcclxuLy8gICAgICAgICByZXR1cm4gT2JqZWN0LnNldFByb3RvdHlwZU9mKGluc3RhbmNlKCksIHYpO1xyXG4vLyAgICAgfSxcclxuLy8gICAgIGlzRXh0ZW5zaWJsZSh0YXJnZXQ6IGFueSkge1xyXG4vLyAgICAgICAgIHJldHVybiBPYmplY3QuaXNFeHRlbnNpYmxlKGluc3RhbmNlKCkpO1xyXG4vLyAgICAgfSxcclxuLy8gICAgIHByZXZlbnRFeHRlbnNpb25zKHRhcmdldDogYW55KSB7XHJcbi8vICAgICAgICAgcmV0dXJuIE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyhpbnN0YW5jZSgpKTtcclxuLy8gICAgIH0sXHJcbi8vICAgICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0OiBhbnksIHA6IFByb3BlcnR5S2V5KSB7XHJcbi8vICAgICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaW5zdGFuY2UoKSwgcCk7XHJcbi8vICAgICB9LFxyXG4vLyAgICAgaGFzKHRhcmdldDogYW55LCBwOiBQcm9wZXJ0eUtleSkge1xyXG4vLyAgICAgICAgIHJldHVybiBwIGluIGluc3RhbmNlKCk7XHJcbi8vICAgICB9LFxyXG4vLyAgICAgZ2V0KHRhcmdldDogYW55LCBwOiBQcm9wZXJ0eUtleSwgcmVjZWl2ZXI6IGFueSkge1xyXG4vLyAgICAgICAgIHJldHVybiBpbnN0YW5jZSgpW3BdO1xyXG4vLyAgICAgfSxcclxuLy8gICAgIHNldCh0YXJnZXQ6IGFueSwgcDogUHJvcGVydHlLZXksIHZhbHVlOiBhbnksIHJlY2VpdmVyOiBhbnkpIHtcclxuLy8gICAgICAgICByZXR1cm4gaW5zdGFuY2UoKVtwXSA9IHZhbHVlO1xyXG4vLyAgICAgfSxcclxuLy8gICAgIGRlZmluZVByb3BlcnR5KHRhcmdldDogYW55LCBwOiBQcm9wZXJ0eUtleSwgYXR0cmlidXRlczogUHJvcGVydHlEZXNjcmlwdG9yKSB7XHJcbi8vICAgICAgICAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShpbnN0YW5jZSgpLCBwLCBhdHRyaWJ1dGVzKTtcclxuLy8gICAgIH0sXHJcbi8vICAgICBlbnVtZXJhdGUodGFyZ2V0OiBhbnkpIHtcclxuLy8gICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMoaW5zdGFuY2UoKSk7XHJcbi8vICAgICB9LFxyXG4vLyAgICAgb3duS2V5cyh0YXJnZXQ6IGFueSkge1xyXG4vLyAgICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhpbnN0YW5jZSgpKTtcclxuLy8gICAgIH1cclxuLy8gfSlcclxuXHJcbi8vIG1vZHVsZS5leHBvcnRzID0gcHJveHk7XHJcbiJdfQ==