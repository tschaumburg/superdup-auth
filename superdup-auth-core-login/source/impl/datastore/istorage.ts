export interface IStorage
{
    retrieve(key: string): string;
    store(key: string, data: string): void;
}

export class LocalStorageStore implements IStorage
{
    public retrieve(key: string): string
    {
        var value = window.localStorage[key];
        if (!value)
            return null;

        return value;
        //return JSON.parse(value) as TData;
    }

    public store(key: string, value: string): void
    {
        //var value = JSON.stringify(data);
        window.localStorage[key] = value;
    }
}
