import logging = require("../logger");
import { IPlugin } from "./iplugin";

export function createPluginManager(): IPluginManager
{
    return new PluginManager();
}

export interface IPluginManager
{
    setLog(log: logging.ILogger): void;

    //********************************************************************
    //* Plugins:
    //* ========
    //* 
    //* 
    //********************************************************************
    registerPlugin<TOptions>(pluginName: string, plugin: IPlugin<TOptions>): void;
    findPlugin<TOptions>(name: string): IPlugin<TOptions>;
}

interface PluginInfo
{
    plugin: Object;
}

class PluginManager implements IPluginManager
{
    private log: logging.ILogger = console;
    public setLog(_log: logging.ILogger): void
    {
        if (!_log)
            _log = console;

        this.log = _log;

        for (var n in this._plugins)
        {
            var info = this._plugins[n];
            var plugin = info.plugin as IPlugin<{}>;
            if (!plugin)
                continue;

            var pluginLog = _log;
            if (!!pluginLog.sublog)
                pluginLog = pluginLog.sublog(n);

            plugin.setLog(pluginLog);
        }
    }

    //********************************************************************
    //* Plugins:
    //* ========
    //* 
    //* 
    //********************************************************************
    private readonly _plugins: { [id: string]: PluginInfo; } = {};

    public registerPlugin<TOptions>(pluginName: string, plugin: IPlugin<TOptions>): void
    {
        this.log.debug("Registering authentication plugin \"" + pluginName + "\"");

        this._plugins[pluginName] = { plugin: plugin };

        if (!!this.log)
        {
            var pluginLog = this.log;
            if (!!pluginLog.sublog)
                pluginLog = pluginLog.sublog(pluginName);

            plugin.setLog(pluginLog);
        }
    }

    public findPlugin<TOptions>(name: string): IPlugin<TOptions>
    {
        var info = this._plugins[name];
        if (!info)
            return null;

        return info.plugin as IPlugin<TOptions>;
    }

    //********************************************************************
    //* IdentityProviders:
    //* ==================
    //* 
    //* 
    //********************************************************************

    public registerIdentityProvider<TOptions>(
        pluginName: string,
        identityProviderName: string,
        providerOptions: TOptions): void
    {
        var plugin = this.findPlugin<TOptions>(pluginName);
        if (!plugin)
        {
            var msg = "Plugin " + pluginName + " has not been properly registered";
            this.log.error(msg);
            throw new Error(msg);
        }

        plugin.registerIdentityProvider(identityProviderName, providerOptions);
    }
}
