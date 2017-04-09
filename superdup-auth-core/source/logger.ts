
export interface ILogger
{
    error(message?: any, ...optionalParams: any[]): void;
    warn(message?: any, ...optionalParams: any[]): void;
    log(message?: any, ...optionalParams: any[]): void;
    info(message?: any, ...optionalParams: any[]): void;
    debug(message?: string, ...optionalParams: any[]): void;
    trace(message?: any, ...optionalParams: any[]): void;

    sublog?: (name: string) => ILogger;
}
export class ConsoleLogger implements ILogger
{
    constructor(private readonly _console: ILogger, private readonly _prefix: string = "") { }

    public error(message?: any, ...optionalParams: any[]): void
    {
        this._console.error(this._prefix + ": " + message, optionalParams);
    }

    public warn(message?: any, ...optionalParams: any[]): void
    {
        this._console.warn(this._prefix + ": " + message, optionalParams);
    }

    public log(message?: any, ...optionalParams: any[]): void
    {
        this._console.log(this._prefix + ": " + message, optionalParams);
    }

    public info(message?: any, ...optionalParams: any[]): void
    {
        this._console.info(this._prefix + ": " + message, optionalParams);
    }

    public debug(message?: string, ...optionalParams: any[]): void
    {
        this._console.debug(this._prefix + ": " + message, optionalParams);
    }

    public trace(message?: any, ...optionalParams: any[]): void
    {
        this._console.trace(this._prefix + ": " + message, optionalParams);
    }

    public sublog(name: string): ILogger
    {
        return new ConsoleLogger(this._console, this._prefix + "." + name);
    }
}