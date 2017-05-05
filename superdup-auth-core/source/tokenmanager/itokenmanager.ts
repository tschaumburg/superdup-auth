import { IToken } from "./itoken";
import { ITokenProvider } from "./itokenprovider";
import { ILog } from "superdup-auth-log";

export interface ITokenManager
{
    registerToken(
        tokenName: string,
        resource: string,
        scopes: string[],
        providedBy: ITokenProvider,
        log: ILog
    ): IToken;

    tokenByName(
        tokenName: string
    ): IToken;

    tokensByProvider(
        providerId: string
    ): IToken[];
}
