import { IApi} from "../apimanager";
import { IToken } from "../tokenmanager";

export class ApiBuilder
{
    public requires(accessToken: IToken): ApiBuilder
    {
        return this;
    }

    public registerAs(name: string): IApi
    {
        return null;
    }
}
