import { ILog } from "superdup-auth-log";
import { IToken } from "../tokenmanager";
import { ILogin2 } from "../login2";
import { ILoginBuilder } from "./iloginbuilder";

export interface IAuthCodeLoginBuilderOps<TSelf> extends ILoginBuilder
{
    refreshToken(val: boolean): TSelf;
}

export interface ITAuthCodeLoginBuilder<TOptions>
{
    withOptions(options: TOptions): IAuthCodeLoginBuilder;
}

export interface IAuthCodeLoginBuilder extends IAuthCodeLoginBuilderOps<IAuthCodeLoginBuilder>
{
}
