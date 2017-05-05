import { ILogin } from "../ilogin";
import { ILog } from "superdup-auth-log";
//import { IImplicitProvider } from "../providers";

export interface IImplicitBuilder<TOptions> {
    withParameters(parameters: TOptions): IImplicitBuilder<TOptions>;
    providingAccessToken(tokenName: string, resource: string, scopes: string[], protectUrls: string[]): IImplicitBuilder<TOptions>;
    registerAs(loginName: string): ILogin;
}
