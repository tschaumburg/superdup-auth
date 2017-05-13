import { ILog } from "superdup-auth-log";
import { IToken } from "../tokenmanager";
import { ILogin2 } from "../login2";
import { IImplicitLoginBuilderOps } from "./iimplicitloginbuilder";
import { IAuthCodeLoginBuilderOps } from "./iauthcodeloginbuilder";
import { } from ".";

export interface IHybridLoginBuilderOps<TSelf> extends IImplicitLoginBuilderOps<TSelf>, IAuthCodeLoginBuilderOps<TSelf>
{
}

export interface ITHybridLoginBuilder<TOptions>
{
    withOptions(options: TOptions): IHybridLoginBuilder;
}

export interface IHybridLoginBuilder extends IHybridLoginBuilderOps<IHybridLoginBuilder>
{
}
