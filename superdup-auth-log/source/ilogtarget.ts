
export interface ILogTarget
{
    fatal(logname: string, message: string): void;
    error(logname: string, message: string): void;
    warn(logname: string, message: string): void;
    info(logname: string, message: string): void;
    debug(logname: string, message: string): void;
}
