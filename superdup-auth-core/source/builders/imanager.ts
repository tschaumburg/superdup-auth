import { ILogger } from "../logger";
import { ILogin } from "./ilogin";
import { IImplicitBuilder } from "./iimplicit";
import { IImplicitProvider } from "../providers";

export interface IBuilderManager
{
    useImplicitFlow<TOptions>(
        flow: new (args: TOptions, log: ILogger) => IImplicitProvider
    ): IImplicitBuilder<TOptions>;

    getLoginNames(): string[];
    getLogin(loginName: string): ILogin;
}

export interface IInternalBuilderManager extends IBuilderManager
{
    registerLogin(loginName: string, login: ILogin): void;
}
