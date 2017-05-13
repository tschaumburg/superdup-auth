import { IApi } from "./iapi"; 

export interface IApiManager
{
    registerApi(urlPrefix: string, tokenName: string): void;
    resolveApi(url: string): string;
    readonly registrations: IApi[];
}
