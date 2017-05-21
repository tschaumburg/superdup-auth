import { IToken } from "superdup-auth-core-tokens";
import { ILogin2 } from "../login2";


export interface IApiBuilder
{
    requiresToken(accessToken: IToken): IApiTokenRequirement;
    registerAs(name: string): void;
}

export interface IApiTokenRequirement
{
    providedBy(login: ILogin2): IApiBuilder;
}
