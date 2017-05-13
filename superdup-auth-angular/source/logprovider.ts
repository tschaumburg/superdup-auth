import angular = require("angular");
import { ILogTarget, ILog, createLog } from "superdup-auth-log"; 
import service = require('./logservice');

export interface ILogServiceProvider extends angular.IServiceProvider
{
    //readonly config: IAuthenticationConfig;
    readonly log: ILog;
}


export class LogServiceProvider implements ILogServiceProvider
{
    public get log(): ILog
    {
        return AngularLog.Current;
    }

    $get = [
        () =>
        {
            var self = this;
            return new service.LogService(() => { return self.log; });
        }];

}

class AngularLog 
{
    private static _target: ILogTarget = null;
    private static _log: ILog = null;
    public static get Current(): ILog
    {
        if (AngularLog._target == null)
            AngularLog._target = new AngularLogTarget();

        if (AngularLog._log == null)
            AngularLog._log = createLog(AngularLog._target, "");

        return AngularLog._log;
    }
}

class AngularLogTarget implements ILogTarget 
{
    private readonly $log: ng.ILogService;
    constructor()
    {
        // see http://stackoverflow.com/questions/25984449/is-it-possible-to-use-logprovider-for-logging-in-config-block-of-the-module
        this.$log = angular.injector(['ng']).get<ng.ILogService>('$log')
        this.$log.debug('Config debug message');
    }

    public fatal(logname: string, message: string): void
    {
        this.$log.error(logname + ": " + message);
    }

    public error(logname: string, message: string): void
    {
        this.$log.error(logname + ": " + message);
    }

    public warn(logname: string, message: string): void
    {
        this.$log.warn(logname + ": " + message);
    }

    public info(logname: string, message: string): void
    {
        this.$log.info(logname + ": " + message);
    }

    public debug(logname: string, message: string): void
    {
        this.$log.debug(logname + ": " + message);
    }
}


