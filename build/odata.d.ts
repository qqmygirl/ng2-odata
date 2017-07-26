import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/rx';
import { ODataConfiguration } from './config';
import { ODataQuery } from './query';
import { GetOperation, GetByAlternateKeyOperation } from './operation';
export declare class ODataService<T> {
    private _typeName;
    private http;
    private config;
    constructor(_typeName: string, http: Http, config: ODataConfiguration);
    readonly TypeName: string;
    Get(key: string): GetOperation<T>;
    GetByAlternateKey(key: string, keyName: string): GetByAlternateKeyOperation<T>;
    Post(entity: T): Observable<T>;
    CustomFunction(actionName: string): Observable<any>;
    CustomFunction(actionName: string, postdata: any): Observable<any>;
    CustomFunction(actionName: string, key: string): Observable<any>;
    CustomFunction(actionName: string, key: string, postdata: any): Observable<any>;
    Patch(entity: any, key: string): Observable<Response>;
    Put(entity: T, key: string): Observable<T>;
    Delete(key: string): Observable<Response>;
    Query(): ODataQuery<T>;
    protected getEntityUri(): string;
    protected getEntityUri(entityKey: string): string;
    protected handleResponse(entity: Observable<Response>): Observable<T>;
    private extractData(res);
    private escapeKey();
}
