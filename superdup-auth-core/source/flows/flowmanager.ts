import logging = require("../logger");
import { Implicit } from "./implicit";

export function createFlowManager(): IFlowManager
{
    return new FlowManager();
}

export interface IFlowManager
{
    setLog(log: logging.ILogger): void;

    //********************************************************************
    //* Plugins:
    //* ========
    //* 
    //* 
    //********************************************************************
    //registerPlugin<TOptions>(pluginName: string, plugin: IPlugin<TOptions>): void;
    registerImplicitFlow<TOptions>(loginName: string, creator: (log: logging.ILogger) => Implicit<TOptions>): void;
    findFlow<TOptions>(name: string): Implicit<TOptions>;
}

interface FlowInfo
{
    creator: (log: logging.ILogger) => Object; //Implicit<TOptions>;
    flow: Object;
}

class FlowManager implements IFlowManager
{
    private log: logging.ILogger = console;
    public setLog(_log: logging.ILogger): void
    {
        if (!_log)
            _log = console;

        this.log = _log;

        //for (var n in this._plugins)
        //{
        //    var info = this._plugins[n];
        //    var plugin = info.plugin as IPlugin<{}>;
        //    if (!plugin)
        //        continue;

        //    var pluginLog = _log;
        //    if (!!pluginLog.sublog)
        //        pluginLog = pluginLog.sublog(n);

        //    plugin.setLog(pluginLog);
        //}
    }

    //********************************************************************
    //* Plugins:
    //* ========
    //* 
    //* 
    //********************************************************************
    private readonly _flows: { [id: string]: FlowInfo; } = {};

    public registerImplicitFlow<TOptions>(
        loginName: string,
        creator: (log: logging.ILogger) => Implicit<TOptions>
    ): void 
    {
        this.log.debug("Registering authentication flow \"" + loginName + "\"");

        this._flows[loginName] = { creator: creator, flow: null };

        //if (!!this.log)
        //{
        //    var pluginLog = this.log;
        //    if (!!pluginLog.sublog)
        //        pluginLog = pluginLog.sublog(loginName);

        //    plugin.setLog(pluginLog);
        //}
    }

    public findFlow<TOptions>(name: string): Implicit<TOptions>
    {
        var info = this._flows[name];
        if (!info)
            return null;

        if (!info.flow)
            info.flow = info.creator(this.log);

        return info.flow as Implicit<TOptions>;
    }

    //********************************************************************
    //* IdentityProviders:
    //* ==================
    //* 
    //* 
    //********************************************************************

    //public registerIdentityProvider<TOptions>(
    //    pluginName: string,
    //    identityProviderName: string,
    //    providerOptions: TOptions): void
    //{
    //    var plugin = this.findPlugin<TOptions>(pluginName);
    //    if (!plugin)
    //    {
    //        var msg = "Plugin " + pluginName + " has not been properly registered";
    //        this.log.error(msg);
    //        throw new Error(msg);
    //    }

    //    plugin.registerIdentityProvider(identityProviderName, providerOptions);
    //}
}
