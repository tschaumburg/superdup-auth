import { ILogin } from "./ilogin";

export interface IAuthCodeLogin extends ILogin 
{
    acquireAccessToken(
        resource: string,
        scopes: string[],
        success: (token: string) => void,
        error: (reason: any) => void
    ): void;
}
