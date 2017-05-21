import { ILogin2 } from "../login2";

export interface ILoginBuilder
{
    onLoginSuccess(callback: (userState: any) => void): void;
    onLoginError(callback: (reason: any) => void): void;
    onLogout(callback: () => void): void;
    registerAs(name: string): ILogin2;
}
