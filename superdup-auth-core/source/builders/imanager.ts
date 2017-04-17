import { ILogger } from "../logger";
import { ILogin } from "../ilogin";
import { IImplicitBuilder } from "./iimplicit";
import { IHybridBuilder } from "./ihybrid";
import { IImplicitProvider, IHybridProvider } from "../providers";

export interface IBuilderManager
{
    useImplicitFlow<TOptions>(
        flow: new (args: TOptions, log: ILogger) => IImplicitProvider
    ): IImplicitBuilder<TOptions>;

    useHybridFlow<TOptions>(
        flow: new (args: TOptions, log: ILogger) => IHybridProvider
    ): IHybridBuilder<TOptions>;

    getLoginNames(): string[];
    getLogin(loginName: string): ILogin;
}

export interface IInternalBuilderManager extends IBuilderManager
{
    registerLogin(loginName: string, login: ILogin): void;
}
