"use strict";
var LinterService = (function () {
    function LinterService() {
    }
    Object.defineProperty(LinterService.prototype, "registry", {
        set: function (registry) {
            this._registry = registry;
        },
        enumerable: true,
        configurable: true
    });
    LinterService.prototype.getLinter = function (name) {
        return this._registry.register({ name: name });
    };
    return LinterService;
}());
exports.LinterService = LinterService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGludGVyU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hdG9tL0xpbnRlclNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQU9BO0lBQUE7SUFTQSxDQUFDO0lBUEcsc0JBQVcsbUNBQVE7YUFBbkIsVUFBb0IsUUFBOEI7WUFDOUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDOUIsQ0FBQzs7O09BQUE7SUFFTSxpQ0FBUyxHQUFoQixVQUFpQixJQUFZO1FBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFLFVBQUksRUFBRSxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUNMLG9CQUFDO0FBQUQsQ0FBQyxBQVRELElBU0M7QUFUWSxxQkFBYSxnQkFTekIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiAgQGxpY2Vuc2UgICBNSVRcclxuICogIEBjb3B5cmlnaHQgT21uaVNoYXJwIFRlYW1cclxuICogIEBzdW1tYXJ5ICAgQWRkcyBzdXBwb3J0IGZvciBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L2xhbmd1YWdlLXNlcnZlci1wcm90b2NvbCAoYW5kIG1vcmUhKSB0byBodHRwczovL2F0b20uaW9cclxuICovXHJcbmltcG9ydCB7IExpbnRlciB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcblxyXG5leHBvcnQgY2xhc3MgTGludGVyU2VydmljZSB7XHJcbiAgICBwcml2YXRlIF9yZWdpc3RyeTogTGludGVyLkluZGllUmVnaXN0cnk7XHJcbiAgICBwdWJsaWMgc2V0IHJlZ2lzdHJ5KHJlZ2lzdHJ5OiBMaW50ZXIuSW5kaWVSZWdpc3RyeSkge1xyXG4gICAgICAgIHRoaXMuX3JlZ2lzdHJ5ID0gcmVnaXN0cnk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldExpbnRlcihuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVnaXN0cnkucmVnaXN0ZXIoeyBuYW1lIH0pO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==