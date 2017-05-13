import { ILogin2 } from "../login2";

export interface ILoginBuilder
{
    registerAs(name: string): ILogin2;
}
