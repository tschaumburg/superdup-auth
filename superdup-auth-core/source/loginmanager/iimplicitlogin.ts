import { UserInfo } from "../userinfo";
import { ILogin } from "./ilogin";

export interface IImplicitLogin extends ILogin 
{
    //readonly user: UserInfo;
    readonly implicitTokenValue: string;
}
