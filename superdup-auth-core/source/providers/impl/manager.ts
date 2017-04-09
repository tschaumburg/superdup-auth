import logging = require("../../logger");
import { IProviderManager } from "../imanager";
import { IImplicitProvider } from "../iimplicit";
import { IHybridProvider } from "../ihybrid";
import { IBaseProvider } from "../ibase";

export function createProviderManager(): IProviderManager
{
    return new ProviderManager();
}

interface FlowInfo
{
    creator: () => IBaseProvider;
    flow: IBaseProvider;
}

class ProviderManager implements IProviderManager
{
    //********************************************************************
    //* Plugins:
    //* ========
    //* 
    //* 
    //********************************************************************
    private readonly _flows: { [id: string]: FlowInfo; } = {};

    public registerImplicitProvider(
        loginName: string,
        creator: () => IImplicitProvider,
        log: logging.ILogger
    ): void 
    {
        log.debug("Registering authentication flow \"" + loginName + "\"");

        this._flows[loginName] = { creator: creator, flow: null };
    }

    public registerHybridProvider(
        loginName: string,
        creator: () => IHybridProvider,
        log: logging.ILogger
    ): void 
    {
        log.debug("Registering hybrid flow \"" + loginName + "\"");

        this._flows[loginName] = { creator: creator, flow: null };
    }

    public findProvider(name: string): IBaseProvider
    {
        var info = this._flows[name];
        if (!info)
            return null;

        if (!info.flow)
            info.flow = info.creator();

        return info.flow;//as IImplicitProvider;
    }
}
