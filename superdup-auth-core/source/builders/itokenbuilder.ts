import { IToken } from "../tokenmanager";

export interface ITokenBuilder
{
    registerAs(name: string): IToken;
}