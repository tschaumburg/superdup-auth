import { IApi } from "./iapi"; 
import { IApiManager } from "./iapimanager"; 
import { IUrlMapper, UrlMapper } from "./urlmapper"; 

export class ApiManager implements IApiManager
{
    private readonly _mapper: IUrlMapper<string> = new UrlMapper<string>();

    public registerApi(urlPrefix: string, tokenName: string): void
    {
        this._mapper.add(urlPrefix, tokenName);
    }

    public resolveApi(url: string): string
    {
        return this._mapper.map(url);
    }

    public get registrations(): IApi[]
    {
        return this._mapper.entries().map(e => { return { urlPrefix: e.urlPrefix, tokenName: e.value}; });
    }
}
