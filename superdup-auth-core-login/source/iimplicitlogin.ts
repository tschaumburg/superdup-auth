import { UserInfo } from "superdup-auth-core-providers";
import { ILogin } from "./ilogin";

export interface IImplicitLogin extends ILogin 
{
    //readonly user: UserInfo;
    readonly implicitTokenValue: string;
}
