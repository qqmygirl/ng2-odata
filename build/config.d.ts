import { RequestOptions, Response } from '@angular/http';
import { PagedResult } from './query';
export declare class KeyConfigs {
    filter: string;
    top: string;
    skip: string;
    orderBy: string;
    select: string;
    expand: string;
}
export declare class ODataConfiguration {
    keys: KeyConfigs;
    baseUrl: string;
    getEntityUri(_typeName: string): string;
    getEntityUri(_typeName: string, entityKey: string): string;
    getEntityUri(_typeName: string, entityKey: string, alternateKey: string): string;
    handleError(err: any, caught: any): void;
    readonly requestOptions: RequestOptions;
    readonly postRequestOptions: RequestOptions;
    extractQueryResultData<T>(res: Response): T[];
    extractQueryResultDataWithCount<T>(res: Response): PagedResult<T>;
}
