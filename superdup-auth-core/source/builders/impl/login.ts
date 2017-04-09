import { UserInfo } from "../../userinfo";
import { ILogin } from "../ilogin";
import { ILogger } from "../../logger";
import { ILoginManager } from "../../iloginmanager";

export class Login implements ILogin {
    constructor(private readonly manager: ILoginManager, private readonly log: ILogger, private readonly name: string) { }

    public login(
        accessTokenName: string,
        userstate: any,
        success: (user: UserInfo, userstate: any) => void,
        error: (reason: any, userstate: any) => void
    ): void {
        this.manager.login(this.name, accessTokenName, userstate, success, error, this.log);
    }

    public get user(): UserInfo {
        return this.manager.getUser(this.name, this.log);
    }

    public getTokenNames(): string[]
    {
        return this.manager.getTokenNames(this.name, this.log);
    }

    getTokenValue(tokenName: string): string
    {
        return this.manager.getTokenValue(tokenName);
    }

    public logout(): void {
        this.manager.logout2(this.name, this.log);
    }

}
