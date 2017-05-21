import { ILog } from "superdup-auth-log";
//import { IEvent, EventDispatcher } from "strongly-typed-events";
import { UserInfo } from "superdup-auth-core-providers";
import { IEvent } from "../ievent";
import { EventDispatcher } from "./event";
import { ILogin } from "../ilogin";
import { IImplicitLogin } from "../iimplicitlogin";
import { IAuthCodeLogin } from "../iauthcodelogin";
import { IHybridLogin } from "../ihybridlogin";
import { ILoginManager } from "../iloginmanager";
import { IProviderAdapter } from "superdup-auth-core-providers";
import { UserStore } from "./userstore";

export class Login implements ILogin, IImplicitLogin, IAuthCodeLogin, IHybridLogin 
{
    constructor(
        private readonly manager: ILoginManager,
        private readonly provider: IProviderAdapter,
        private readonly _userManager: UserStore,
        private readonly log: ILog,
        //private readonly _onLoginSuccess: (userstate: any) => void,
        //private readonly _onLoginError: (reason: any) => void,
        //private readonly _onLogout: () => void,
        public readonly name: string
    ) { }

    //********************************************************************
    //* ILogin: basic login/logout:
    //* ===========================
    //* 
    //* 
    //********************************************************************
    public login(
        userstate: any,
        success: (userstate: any) => void,
        redirecting: () => void,
        error: (reason: any) => void
    ): void 
    {
        this.log.info("login(loginName=" + this.name + ")");

        var nonce: string = this.makeNonce(); // this.createNonce(loginName, accessTokenName);
        var encodedState = JSON.stringify({ flow: this.name, nonce: nonce, uss: userstate });

        this.log.info("login(loginName=" + this.name + ", nonce=" + nonce + /*", token=" + JSON.stringify(tokeninfo) +*/ ")");
        this.provider.login(
            nonce,
            encodedState,
            (user, accessTokenName, accessTokenValue) =>
            {
                this.log.info("Login succeeeded!");
                this._implicitTokenValue = accessTokenValue;
                this._userManager.set(this.name, user);
                if (!!success)
                    success(userstate);
                this._loggedIn.dispatch();
            },
            () =>
            {
                if (!!redirecting)
                    redirecting();
            },
            (reason) =>
            {
                if (!!error)
                    error(reason);
            }
        );
    }

    private makeNonce(): string
    {
        var length = 10;
        var text = "n"; // prefix "n" => nonce is valid property name
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++)
        {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    public logout(): void
    {
        this._loggingOut.dispatch();
        //this.manager.logout2(this.name, this.log);
        this.log.info("Logging out");
        this.provider.logout();
        this._implicitTokenValue = null;
        this._userManager.clear(this.name);
    }

    private readonly _loggedIn: EventDispatcher = new EventDispatcher(); // IEvent<void, void> = new EventDispatcher<void, void>();
    public get loggedIn(): IEvent { return this._loggedIn; }

    private readonly _loggingOut: EventDispatcher = new EventDispatcher(); //EventDispatcher<void, void> = new EventDispatcher<void, void>();
    public get loggingOut(): IEvent { return this._loggingOut; }

    //********************************************************************
    //* IImplicitLogin:
    //* ===================
    //* 
    //* 
    //********************************************************************

    public identityTokenRequest: boolean;

    public get user(): UserInfo {
        return this._userManager.get(this.name);
    }

    public implicitTokenRequest: { resource: string, scopes: string[] };

    private _implicitTokenValue: string;
    public get implicitTokenValue(): string { return this._implicitTokenValue; }

    //********************************************************************
    //* IAuthCodeLogin:
    //* ===================
    //* 
    //* 
    //********************************************************************

    public acquireAccessToken(
        resource: string,
        scopes: string[],
        success: (token: string) => void,
        error: (reason: any) => void
    ): void
    {
        this.provider.requestAccessToken(resource, scopes, success, error);
    }
}

