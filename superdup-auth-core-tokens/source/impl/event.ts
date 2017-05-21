import { IEvent } from "../ievent";

export class EventDispatcher implements IEvent
{
    private _subscriptions: Array<() => void> = new Array<() => void>();

    public subscribe(fn: () => void): void
    {
        if (fn)
        {
            this._subscriptions.push(fn);
        }
    }

    public unsubscribe(fn: () => void): void
    {
        let i = this._subscriptions.indexOf(fn);
        if (i > -1)
        {
            this._subscriptions.splice(i, 1);
        }
    }

    public dispatch(): void
    {
        for (let handler of this._subscriptions)
        {
            handler();
        }
    }

    public clear(): void
    {
        this._subscriptions = [];
    }
}
