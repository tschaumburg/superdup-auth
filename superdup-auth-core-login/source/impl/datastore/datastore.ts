import { IStorage } from "./istorage";
import { ILog } from "superdup-auth-log";

export class DataStore<TData>
{
    public constructor(private readonly _storage: IStorage, private readonly _storagekey: string, private readonly log: ILog)
    {
        this.loadState();
    }

    private _cache: { [id: string]: TData; } = {};

    public set(key: string, value: TData): void
    {
        this.log.debug("Datastore.set('" + key + "', " + JSON.stringify(value) + ")");
        this._cache[key] = value;
        this.saveState();
    }

    public get(key: string): TData 
    {
        var res = this._cache[key];

        this.log.debug("Datastore.get('" + key + "') returns " + JSON.stringify(res));

        return res;
    }

    public clear(key: string): void
    {
        this._cache[key] = null;
        this.saveState();
    }

    private loadState()
    {
        this.log.info("Reloading persisted state...");
        var serializedState = this._storage.retrieve(this._storagekey);
        this._cache = JSON.parse(serializedState) as { [id: string]: TData; };

        if (!this._cache)
        {
            this.log.info("...no data found");
            this._cache = {};
        }
    }

    private saveState()
    {
        this.log.info("Persisting state...");

        var serializedState = JSON.stringify(this._cache);
        this._storage.store(this._storagekey, serializedState);
    }
}