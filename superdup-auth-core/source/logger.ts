
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