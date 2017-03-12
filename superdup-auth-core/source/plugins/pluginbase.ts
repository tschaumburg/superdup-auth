import { ILogger } from "../logger";
import { UserInfo } from "../users";
import { IPlugin } from "./iplugin";
import { IIdentityProvider } from "./iidentityprovider";


export abstract class PluginBase<TOptions> implements IPlugin<TOptions>
{
    private log: ILogger = console;
    public setLog(log: ILogger): void
    {
        this.log = log;

        for (var n in this._identityProviders)
        {
            var idp = this._identityProviders[n] as IIdentityProvider;
            if (!idp)
                continue;

            var idpLog = log;
            if (!!idpLog.sublog)
                idpLog = idpLog.sublog(n);

            idp.setLog(idpLog);
        }
    }

    //********************************************************************
    //* Plugins:
    //* ========
    //* 
    //* 
    //********************************************************************
    private readonly _identityProviders: { [id: string]: IIdentityProvider; } = {};

    public registerIdentityProvider(
        identityProviderName: string,
        providerOptions: TOptions
    ): void
    {
        this.log.debug("Registering identity provider \"" + identityProviderName + "\"");

        if (!!this._identityProviders[identityProviderName])
        {
            var msg = "Identity provider " + identityProviderName + " has already been registered";
            this.log.error(msg);
            throw new Error(msg);
        }

        this._identityProviders[identityProviderName] = this.createIdentityProvider(identityProviderName, providerOptions);
    }

    protected abstract createIdentityProvider(
        identityProviderName: string,
        providerOptions: TOptions
    ): IIdentityProvider;

    //********************************************************************
    //* Login:
    //* ======
    //* 
    //* 
    //********************************************************************
    public login(
        identityProviderName: string,
        state: { mod: string, uss: any },
        requestAccessToken: { name: string, resource: string, scopes: string[] },
        success: (user: UserInfo, accessToken: string, userstate: any) => void,
        error: (reason: any, userstate: any) => void
    ): void
    {
        if (!identityProviderName)
        {
            var msg = "login(): identity provider not specified";
            this.log.error(msg);
            return error(msg, state.uss);
        }

        var idp = this._identityProviders[identityProviderName];
        if (!idp)
        {
            var msg = "login(): identity provider " + identityProviderName + " has not been registered";
            this.log.error(msg);
            return error(msg, state.uss);
        }

        idp.login(
            { mod: state.mod, idp: identityProviderName, uss: state.uss },
            requestAccessToken,
            success,
            error
        );
    }

    public handleRedirect(
        identityProviderName: string,
        accessTokenName: string,
        actualRedirectUrl: string,
        userstate: any,
        success: (user: UserInfo, accessToken: string, userstate: any) => void,
        error: (reason: any, userstate: any) => void
    ): void
    {
        var idp = this._identityProviders[identityProviderName];
        if (!idp)
            throw new Error("Identity provder " + identityProviderName + " has not been registered");

        idp.handleRedirect(
            accessTokenName,
            actualRedirectUrl,
            userstate,
            success,
            error
        );
    }

    public acquireAccessToken(
        identityProviderName: string,
        resource: string,
        scopes: string[],
        refreshIfPossible: boolean,
        success: (accessToken: string) => void,
        error: (reason: any) => void
    ): void
    {
        var idp = this._identityProviders[identityProviderName];
        if (!idp)
            throw new Error("Identity provder " + identityProviderName + " has not been registered");

        idp.acquireAccessToken(
            resource,
            scopes,
            refreshIfPossible,
            success,
            error
        );
    }
}
