
export interface ILog
{
    fatal(message?: any, ...optionalParams: any[]): void;
    error(message?: any, ...optionalParams: any[]): void;
    warn(message?: any, ...optionalParams: any[]): void;
    info(message?: any, ...optionalParams: any[]): void;
    debug(message?: string, ...optionalParams: any[]): void;

    sublog(name: string): ILog;
}
