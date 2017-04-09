import { ILogin } from "./ilogin";
import { ILogger } from "../logger";
import { IImplicitProvider } from "../providers";

export interface IHybridBuilder<TOptions>
{
    withParameters(parameters: TOptions): IHybridBuilder<TOptions>;
    providingAccessToken(tokenName: string, resource: string, scopes: string[], protectUrls: string[]): IHybridBuilder<TOptions>;
    registerAs(loginName: string): ILogin;
}
