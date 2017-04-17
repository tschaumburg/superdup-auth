import { ILogin } from "../ilogin";
import { ILogger } from "../logger";
import { IImplicitProvider } from "../providers";

export interface IImplicitBuilder<TOptions> {
    withParameters(parameters: TOptions): IImplicitBuilder<TOptions>;
    providingAccessToken(tokenName: string, resource: string, scopes: string[], protectUrls: string[]): IImplicitBuilder<TOptions>;
    registerAs(loginName: string): ILogin;
}
