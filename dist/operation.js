"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("@angular/http");
var rx_1 = require("rxjs/rx");
var ODataOperation = (function () {
    function ODataOperation(_typeName, config, http) {
        this._typeName = _typeName;
        this.config = config;
        this.http = http;
    }
    ODataOperation.prototype.Expand = function (expand) {
        this._expand = this.parseStringOrStringArray(expand);
        return this;
    };
    ODataOperation.prototype.Select = function (select) {
        this._select = this.parseStringOrStringArray(select);
        return this;
    };
    ODataOperation.prototype.getParams = function () {
        var params = new http_1.URLSearchParams();
        if (this._select && this._select.length > 0)
            params.set(this.config.keys.select, this._select);
        if (this._expand && this._expand.length > 0)
            params.set(this.config.keys.expand, this._expand);
        return params;
    };
    ODataOperation.prototype.handleResponse = function (entity) {
        var _this = this;
        return entity.map(this.extractData)
            .catch(function (err, caught) {
            if (_this.config.handleError)
                _this.config.handleError(err, caught);
            return rx_1.Observable.throw(err);
        });
    };
    ODataOperation.prototype.getEntityUri = function (entityKey, keyName) {
        return this.config.getEntityUri(this._typeName, entityKey, keyName);
    };
    ODataOperation.prototype.getRequestOptions = function () {
        var options = this.config.requestOptions;
        options.search = this.getParams();
        return options;
    };
    ODataOperation.prototype.parseStringOrStringArray = function (input) {
        if (input instanceof Array) {
            return input.join(',');
        }
        return input;
    };
    ODataOperation.prototype.extractData = function (res) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        var body = res.json();
        var entity = body;
        return entity || null;
    };
    return ODataOperation;
}());
exports.ODataOperation = ODataOperation;
var OperationWithKey = (function (_super) {
    __extends(OperationWithKey, _super);
    function OperationWithKey(_typeName, config, http, key) {
        var _this = _super.call(this, _typeName, config, http) || this;
        _this._typeName = _typeName;
        _this.config = config;
        _this.http = http;
        _this.key = key;
        return _this;
    }
    return OperationWithKey;
}(ODataOperation));
exports.OperationWithKey = OperationWithKey;
var OperationWithEntity = (function (_super) {
    __extends(OperationWithEntity, _super);
    function OperationWithEntity(_typeName, config, http, entity) {
        var _this = _super.call(this, _typeName, config, http) || this;
        _this._typeName = _typeName;
        _this.config = config;
        _this.http = http;
        _this.entity = entity;
        return _this;
    }
    return OperationWithEntity;
}(ODataOperation));
exports.OperationWithEntity = OperationWithEntity;
var OperationWithKeyAndEntity = (function (_super) {
    __extends(OperationWithKeyAndEntity, _super);
    function OperationWithKeyAndEntity(_typeName, config, http, key, entity) {
        var _this = _super.call(this, _typeName, config, http) || this;
        _this._typeName = _typeName;
        _this.config = config;
        _this.http = http;
        _this.key = key;
        _this.entity = entity;
        return _this;
    }
    return OperationWithKeyAndEntity;
}(ODataOperation));
exports.OperationWithKeyAndEntity = OperationWithKeyAndEntity;
var OperationWithAlternateKey = (function (_super) {
    __extends(OperationWithAlternateKey, _super);
    function OperationWithAlternateKey(_typeName, config, http, key, keyName) {
        var _this = _super.call(this, _typeName, config, http) || this;
        _this._typeName = _typeName;
        _this.config = config;
        _this.http = http;
        _this.key = key;
        _this.keyName = keyName;
        return _this;
    }
    return OperationWithAlternateKey;
}(ODataOperation));
exports.OperationWithAlternateKey = OperationWithAlternateKey;
var GetOperation = (function (_super) {
    __extends(GetOperation, _super);
    function GetOperation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GetOperation.prototype.Exec = function () {
        return _super.prototype.handleResponse.call(this, this.http.get(this.getEntityUri(this.key), this.getRequestOptions()));
    };
    return GetOperation;
}(OperationWithKey));
exports.GetOperation = GetOperation;
var GetByAlternateKeyOperation = (function (_super) {
    __extends(GetByAlternateKeyOperation, _super);
    function GetByAlternateKeyOperation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GetByAlternateKeyOperation.prototype.Exec = function () {
        return _super.prototype.handleResponse.call(this, this.http.get(this.getEntityUri(this.key, this.keyName), this.getRequestOptions()));
    };
    return GetByAlternateKeyOperation;
}(OperationWithAlternateKey));
exports.GetByAlternateKeyOperation = GetByAlternateKeyOperation;
// export class PostOperation<T> extends OperationWithEntity<T>{
//     public Exec():Observable<T>{    //ToDo: Check ODataV4
//         let body = JSON.stringify(this.entity);
//         return this.handleResponse(this.http.post(this.config.baseUrl + "/"+this._typeName, body, this.getRequestOptions()));
//     }
// }
// export class PatchOperation<T> extends OperationWithKeyAndEntity<T>{
//     public Exec():Observable<Response>{    //ToDo: Check ODataV4
//         let body = JSON.stringify(this.entity);
//         return this.http.patch(this.getEntityUri(this.key),body,this.getRequestOptions());
//     }
// }
// export class PutOperation<T> extends OperationWithKeyAndEntity<T>{
//     public Exec(){
//         let body = JSON.stringify(this.entity);
//         return this.handleResponse(this.http.put(this.getEntityUri(this.key),body,this.getRequestOptions()));
//     }
// }
//# sourceMappingURL=operation.js.map