import { IToken } from "superdup-auth-core-tokens";
import { ILogin2 } from "../login2";
import { ILoginBuilder } from "./iloginbuilder";


export interface IImplicitLoginBuilderOps<TSelf> extends ILoginBuilder
{
    accessToken(token: IToken): TSelf;
    idToken(...idScopes: string[]): TSelf;
}

export interface ITImplicitLoginBuilder<TOptions>
{
    withOptions(options: TOptions): IImplicitLoginBuilder;
}

export interface IImplicitLoginBuilder extends IImplicitLoginBuilderOps<IImplicitLoginBuilder>
{
}
