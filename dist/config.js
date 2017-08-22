"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const http_1 = require("@angular/http");
const query_1 = require("./query");
// import { Location } from '@angular/common';
class KeyConfigs {
    constructor() {
        this.filter = '$filter';
        this.top = '$top';
        this.skip = '$skip';
        this.orderBy = '$orderby';
        this.select = '$select';
        this.expand = '$expand';
    }
}
exports.KeyConfigs = KeyConfigs;
let ODataConfiguration = class ODataConfiguration {
    constructor() {
        this.keys = new KeyConfigs();
        this.baseUrl = 'http://localhost/odata';
    }
    getEntityUri(_typeName, entityKey, alternateKey) {
        let uri = this.baseUrl + '/' + _typeName;
        if (alternateKey != undefined) {
            return uri + `(${alternateKey}='${entityKey}')`;
        }
        if (entityKey != undefined) {
            // check if string is a GUID (UUID) type
            if (/^[{(]?[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}[)}]?$/i.test(entityKey)) {
                return uri + '(' + entityKey + ')';
            }
            if (!/^[0-9]*$/.test(entityKey)) {
                return uri + '(\'' + entityKey + '\')';
            }
            return uri + '(' + entityKey + ')';
        }
        return uri;
    }
    handleError(err, caught) {
        console.warn('OData error: ', err, caught);
    }
    ;
    get requestOptions() {
        return new http_1.RequestOptions({
            body: ''
        });
    }
    ;
    get postRequestOptions() {
        let headers = new http_1.Headers({
            'Content-Type': 'application/json; charset=utf-8'
        });
        return new http_1.RequestOptions({
            headers: headers
        });
    }
    extractQueryResultData(res) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        let entities = body.value;
        return entities;
    }
    extractQueryResultDataWithCount(res) {
        let pagedResult = new query_1.PagedResult();
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        let entities = body.value;
        pagedResult.data = entities;
        try {
            let count = parseInt(body['@odata.count'], 10) || entities.length;
            pagedResult.count = count;
        }
        catch (error) {
            console.warn('Cannot determine OData entities count. Falling back to collection length...');
            pagedResult.count = entities.length;
        }
        return pagedResult;
    }
};
ODataConfiguration = __decorate([
    core_1.Injectable()
], ODataConfiguration);
exports.ODataConfiguration = ODataConfiguration;
//# sourceMappingURL=config.js.map