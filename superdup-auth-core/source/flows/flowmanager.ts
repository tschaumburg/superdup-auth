import logging = require("../logger");
import { Implicit } from "./implicitflow";
import { Hybrid } from "./hybridflow";
import { IBaseFlow } from "./baseflow";

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
    registerImplicitFlow<TOptions>(loginName: string, creator: (log: logging.ILogger) => Implicit<TOptions>): void;
    registerHybridFlow<TOptions>(loginName: string, creator: (log: logging.ILogger) => Hybrid<TOptions>): void;
    findFlow<TOptions>(name: string): IBaseFlow;
}

interface FlowInfo
{
    creator: (log: logging.ILogger) => IBaseFlow; //Implicit<TOptions>;
    flow: IBaseFlow;
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
    ): void {
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

    public registerHybridFlow<TOptions>(
        loginName: string,
        creator: (log: logging.ILogger) => Hybrid<TOptions>
    ): void 
    {
        this.log.debug("Registering hybrid flow \"" + loginName + "\"");

        this._flows[loginName] = { creator: creator, flow: null };
    }

    public findFlow<TOptions>(name: string): IBaseFlow
    {
        var info = this._flows[name];
        if (!info)
            return null;

        if (!info.flow)
            info.flow = info.creator(this.log);

        return info.flow as Implicit<TOptions>;
    }
}
