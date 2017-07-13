"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const core_1 = require('@angular/core');
const http_1 = require('@angular/http');
const query_1 = require('./query');
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
    getEntityUri(entityKey, _typeName, alternateKey) {
        if (alternateKey != undefined) {
            return `${this.baseUrl}/${_typeName}(${alternateKey}='${entityKey}')`;
        }
        // check if string is a GUID (UUID) type
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(entityKey)) {
            return this.baseUrl + '/' + _typeName + '(' + entityKey + ')';
        }
        if (!/^[0-9]*$/.test(entityKey)) {
            return this.baseUrl + '/' + _typeName + '(\'' + entityKey + '\')';
        }
        return this.baseUrl + '/' + _typeName + '(' + entityKey + ')';
    }
    handleError(err, caught) {
        console.warn('OData error: ', err, caught);
    }
    ;
    get requestOptions() {
        return new http_1.RequestOptions({ body: '' });
    }
    ;
    get postRequestOptions() {
        let headers = new http_1.Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return new http_1.RequestOptions({ headers: headers });
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
    core_1.Injectable(), 
    __metadata('design:paramtypes', [])
], ODataConfiguration);
exports.ODataConfiguration = ODataConfiguration;
//# sourceMappingURL=config.js.map