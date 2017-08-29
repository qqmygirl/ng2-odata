import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ODataService } from './odata';
import { ODataConfiguration } from './config';

@Injectable()
export class ODataServiceFactory {

    constructor(private http: HttpClient, private config: ODataConfiguration) {
    }

    public CreateService<T>(typeName: string, handleError?: (err: any) => any): ODataService<T> {
        return new ODataService<T>(typeName, this.http, this.config);
    }

    public CreateServiceWithOptions<T>(typeName: string, config: ODataConfiguration): ODataService<T> {
        return new ODataService<T>(typeName, this.http, config);
    }
}
