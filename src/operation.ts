import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, Operator } from 'rxjs/Rx';
import { ODataConfiguration } from './config';

export abstract class ODataOperation<T> {
    private _expand: string;
    private _select: string;

    constructor(protected _typeName: string,
                protected config: ODataConfiguration,
                protected http: HttpClient) { }

    public Expand(expand: string | string[]) {
        this._expand = this.parseStringOrStringArray(expand);
        return this;
    }

    public Select(select: string | string[]) {
        this._select = this.parseStringOrStringArray(select);
        return this;
    }

    protected getParams(): HttpParams {
        let params: HttpParams = new HttpParams();
        if (this._select && this._select.length > 0) params = params.set(this.config.keys.select, this._select);
        if (this._expand && this._expand.length > 0) params = params.set(this.config.keys.expand, this._expand);
        return params;
    }

    protected getEntityUri(entityKey: string): string;
    protected getEntityUri(entityKey: string, keyName: string): string;
    protected getEntityUri(entityKey: string, keyName?: string): string {
        return this.config.getEntityUri(this._typeName, entityKey, keyName);
    }

    protected getRequestOptions(): Object {
        return {
            params: this.getParams()
        };
    }

    abstract Exec(...args): Observable<any>;

    protected parseStringOrStringArray(input: string | string[]): string {
        if (input instanceof Array) {
            return input.join(',');
        }

        return input as string;
    }
}

export abstract class OperationWithKey<T> extends ODataOperation<T> {
    constructor(protected _typeName: string,
                protected config: ODataConfiguration,
                protected http: HttpClient,
                protected key: string) {
                    super(_typeName, config, http);
                }
    abstract Exec(...args): Observable<any>;
}

export abstract class OperationWithEntity<T> extends ODataOperation<T> {
    constructor(protected _typeName: string,
                protected config: ODataConfiguration,
                protected http: HttpClient,
                protected entity: T) {
                    super(_typeName, config, http);
                }
    abstract Exec(...args): Observable<any>;
}

export abstract class OperationWithKeyAndEntity<T> extends ODataOperation<T> {
    constructor(protected _typeName: string,
                protected config: ODataConfiguration,
                protected http: HttpClient,
                protected key: string,
                protected entity: T) {
                    super(_typeName, config, http);
                }
    abstract Exec(...args): Observable<any>;
}

export abstract class OperationWithAlternateKey<T> extends ODataOperation<T> {
    constructor(protected _typeName: string,
        protected config: ODataConfiguration,
        protected http: HttpClient,
        protected key: string,
        protected keyName: string) {
            super(_typeName, config, http);
    }
    abstract Exec(...args): Observable<any>;
}

export class GetOperation<T> extends OperationWithKey<T> {
    public Exec(): Observable<T> {
        return this.http.get<T>(this.getEntityUri(this.key), this.getRequestOptions());
    }
}

export class GetByAlternateKeyOperation<T> extends OperationWithAlternateKey<T> {
    public Exec(): Observable<T> {
        return this.http.get<T>(this.getEntityUri(this.key, this.keyName), this.getRequestOptions());
    }
}

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
