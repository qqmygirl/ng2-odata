"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var odata_1 = require("./odata");
var ODataServiceFactory = (function () {
    function ODataServiceFactory(http, config) {
        this.http = http;
        this.config = config;
    }
    ODataServiceFactory.prototype.CreateService = function (typeName, handleError) {
        return new odata_1.ODataService(typeName, this.http, this.config);
    };
    ODataServiceFactory.prototype.CreateServiceWithOptions = function (typeName, config) {
        return new odata_1.ODataService(typeName, this.http, config);
    };
    return ODataServiceFactory;
}());
ODataServiceFactory = __decorate([
    core_1.Injectable()
], ODataServiceFactory);
exports.ODataServiceFactory = ODataServiceFactory;
//# sourceMappingURL=odataservicefactory.js.map