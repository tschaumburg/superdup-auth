import { IImplicitLogin } from "./iimplicitlogin";
import { IAuthCodeLogin } from "./iauthcodelogin";

export interface IHybridLogin extends IAuthCodeLogin, IImplicitLogin 
{
}
