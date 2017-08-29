import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, Operator } from 'rxjs/Rx';
import { ODataConfiguration} from './config';
import { ODataQuery } from './query';
import { GetOperation, GetByAlternateKeyOperation } from './operation';

export class ODataService <T> {

    constructor(private _typeName: string, private http: HttpClient, private config: ODataConfiguration) {}

    public get TypeName() {
        return this._typeName;
    }

    public Get(key: string): GetOperation <T> {
        return new GetOperation <T> (this._typeName, this.config, this.http, key);
    }

    public GetByAlternateKey(key: string, keyName: string): GetByAlternateKeyOperation <T> {
        return new GetByAlternateKeyOperation <T> (this._typeName, this.config, this.http, key, keyName);
    }

    public Post(entity: T): Observable <T> {
        const body = JSON.stringify(entity);
        return this.http.post<T>(
            this.config.baseUrl + '/' + this.TypeName, body);
    }

    public CustomFunction(actionName: string): Observable <Object> ;
    public CustomFunction(actionName: string, key: string): Observable <Object> ;
    public CustomFunction(actionName: string, key: string, postdata: any): Observable <Object> ;
    public CustomFunction(actionName: string, key? : string, postdata? : any): Observable <Object> {
        let url = this.getEntityUri(key) + '/' + actionName;

        if (postdata != undefined) {
            let body = JSON.stringify(postdata);
            return this.http.post(url, body);
        }
        return this.http.get(url);
    }

    public Patch(entity: any, key: string): Observable <T> {
        const body: string = JSON.stringify(entity);
        return this.http.patch<T>(this.getEntityUri(key), body);
    }

    public Put(entity: T, key: string): Observable <T> {
        const body: string = JSON.stringify(entity);
        return this.http.put<T>(this.getEntityUri(key), body);
    }

    public Delete(key: string): Observable <T> {
        return this.http.delete<T>(this.getEntityUri(key));
    }

    public Query(): ODataQuery <T> {
        return new ODataQuery <T> (this.TypeName, this.config, this.http);
    }

    protected getEntityUri(): string;
    protected getEntityUri(entityKey: string): string;
    protected getEntityUri(entityKey?: string): string {
        return this.config.getEntityUri(this._typeName, entityKey);
    }

    private extractData(res: HttpResponse<T>): T {
        if (res.status <200 || res.status>= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body: any = res.body;
        return body || null;
    }
}