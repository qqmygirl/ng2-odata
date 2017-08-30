import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { PagedResult } from './query';

export class KeyConfigs {
    public filter: string = '$filter';
    public top: string = '$top';
    public skip: string = '$skip';
    public orderBy: string = '$orderby';
    public select: string = '$select';
    public expand: string = '$expand';
}

@Injectable()
export class ODataConfiguration {
    public keys: KeyConfigs = new KeyConfigs();
    public baseUrl: string = 'http://localhost/odata';

    public getEntityUri(_typeName: string): string;
    public getEntityUri(_typeName: string, entityKey: string): string;
    public getEntityUri(_typeName: string, entityKey: string, alternateKey: string): string;
    public getEntityUri(_typeName: string, entityKey?: string, alternateKey?: string): string {
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

    handleError(err: any, caught: any): void {
        console.warn('OData error: ', err, caught);
    }

    get requestOptions(): Object {
        return {
            observe: 'response',
            body: ''
        };
    }

    get postRequestOptions(): Object {
        let headers = new HttpHeaders()
        .set('Content-Type', 'application/json');

        return {
            observe: 'response',
            headers: headers
        };
    }

    public extractQueryResultData<T>(res: HttpResponse<T>): T[] {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body: T = res.body;
        let entities: T[] = body['value'];
        return entities;
    }

    public extractQueryResultDataWithCount<T>(res: HttpResponse<T>): PagedResult<T> {
        let pagedResult = new PagedResult<T>();

        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body: T = res.body;
        let entities: T[] = body['value'];

        pagedResult.data = entities;

        try {
            let count = parseInt(body['@odata.count'], 10) || entities.length;
            pagedResult.count = count;
        } catch (error) {
            console.warn('Cannot determine OData entities count. Falling back to collection length...');
            pagedResult.count = entities.length;
        }

        return pagedResult;
    }
}