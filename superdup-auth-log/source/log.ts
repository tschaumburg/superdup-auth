import { ILog } from "./ilog";
import { ILogTarget } from "./ilogtarget";

export function createLog(target: ILogTarget, logname: string): ILog
{
    return new Log(target, logname);
}

export class Log implements ILog
{
    private readonly _logname: string;
    constructor(private readonly _target: ILogTarget, _logname: string)
    {
        if (!_logname)
            _logname = "";

        this._logname = _logname;
    };

    private format(message?: any, ...optionalParams: any[]): string
    {
        return message;
    }

    public fatal(message?: any, ...optionalParams: any[]): void
    {
        this._target.fatal(this._logname, this.format(message, optionalParams));
    }

    public error(message?: any, ...optionalParams: any[]): void
    {
        this._target.error(this._logname, this.format(message, optionalParams));
    }
;
    public warn(message?: any, ...optionalParams: any[]): void
    {
        this._target.warn(this._logname, this.format(message, optionalParams));
    }

    public info(message?: any, ...optionalParams: any[]): void
    {
        this._target.info(this._logname, this.format(message, optionalParams));
    }

    public debug(message?: string, ...optionalParams: any[]): void
    {
        this._target.debug(this._logname, this.format(message, optionalParams));
    }


    public sublog(name: string): ILog
    {
        var sub = this._logname;

        if (sub === "" || sub == null)
            sub = name;
        else
            sub = sub + "." + name;

        return new Log(this._target, sub);
    }
}
