import { IToken } from "superdup-auth-core-tokens";

export interface ITokenBuilder
{
    registerAs(name: string): IToken;
}