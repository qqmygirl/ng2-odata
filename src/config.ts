import { Injectable } from '@angular/core';
import { RequestOptions, Headers, Response } from '@angular/http';
import { PagedResult } from './query';
// import { Location } from '@angular/common';

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

    public getEntityUri(entityKey: string, _typeName: string): string;
    public getEntityUri(entityKey: string, _typeName: string, alternateKey: string): string;

    public getEntityUri(entityKey: string, _typeName: string, alternateKey?: string): string {
        if(alternateKey != undefined) {            
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

    handleError(err: any, caught: any): void {
        console.warn('OData error: ', err, caught);
    };

    get requestOptions(): RequestOptions {
        return new RequestOptions({ body: '' });
    };

    get postRequestOptions(): RequestOptions {
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return new RequestOptions({ headers: headers });
    }

    public extractQueryResultData<T>(res: Response): T[] {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        let entities: T[] = body.value;
        return entities;
    }

    public extractQueryResultDataWithCount<T>(res: Response): PagedResult<T> {
        let pagedResult = new PagedResult<T>();

        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        let entities: T[] = body.value;

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
