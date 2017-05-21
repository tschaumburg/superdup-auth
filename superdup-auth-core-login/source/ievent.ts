export interface IEvent
{
    subscribe(fn: () => void): void;
    unsubscribe(fn: () => void): void;
}
