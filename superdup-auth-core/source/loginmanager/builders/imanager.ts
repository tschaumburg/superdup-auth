import { ILog } from "superdup-auth-log";
import { ILogin } from "../ilogin";
import { IImplicitBuilder } from "./iimplicit";
import { IHybridBuilder } from "./ihybrid";
import { IImplicitProvider, IHybridProvider } from "../../providermanager";

export interface IBuilderManager
{
    useImplicitFlow<TOptions>(
        flow: new (args: TOptions, log: ILog) => IImplicitProvider
    ): IImplicitBuilder<TOptions>;

    useHybridFlow<TOptions>(
        flow: new (args: TOptions, log: ILog) => IHybridProvider
    ): IHybridBuilder<TOptions>;

    getLoginNames(): string[];
    getLogin(loginName: string): ILogin;
}

export interface IInternalBuilderManager extends IBuilderManager
{
    registerLogin(loginName: string, login: ILogin): void;
}
