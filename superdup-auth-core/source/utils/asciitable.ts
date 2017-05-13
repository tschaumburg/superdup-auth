export class AsciiTable
{
    private static readonly SPACES =
    "                                                                                              " +
    "                                                                                              ";
    private static readonly HYPHENS =
    "----------------------------------------------------------------------------------------------" +
    "----------------------------------------------------------------------------------------------" +
    "----------------------------------------------------------------------------------------------" +
    "----------------------------------------------------------------------------------------------";
    private readonly colWidths: number[];
    constructor(...colWidths: number[])
    {
        this.colWidths = colWidths;
    }

    private res = "";
    private nextCol = 0;
    private _AddCell(text: string, colspan: number, cellPrefix: string): void
    {
        if (!text)
            text = "-";
        var cols = this.colWidths.slice(this.nextCol, this.nextCol + colspan);
        //var space = cols.reduce((prev, curr, idx, all) => prev + curr, 0);
        var space = this.nChars(this.nextCol, colspan);

        if (space <= 0)
            return;

        if (space > text.length)
        {
            var extra = space - text.length;
            var before = Math.floor(extra / 2);
            var after = extra - before;
            text = AsciiTable.SPACES.substr(0, before) + text + AsciiTable.SPACES.substr(0, after);
        }

        if (space < text.length)
        {
            text = text.substr(0, space - 2) + "..";
        }

        this.res += cellPrefix;
        this.res += text;

        this.nextCol += colspan;
    }

    public AddCell(text: string, colspan?: number): AsciiTable
    {
        if (!colspan)
            colspan = 1;

        this._AddCell(text, colspan, " | ");
        return this;
    }

    private _Newline(lineEnd: string): void
    {
        this.res += lineEnd + "\n";
        this.nextCol = 0;
    }

    public Newline(): AsciiTable
    {
        this._Newline(" |");
        return this;
    }

    private nChars(startCol: number, colNo: number): number
    {
        if (colNo <= 0)
            return 0;

        var cols = this.colWidths.slice(this.nextCol, this.nextCol + colNo);
        var colspace = cols.reduce((prev, curr, idx, all) => prev + curr);
        var res = colspace + (colNo - 1) * 3;

        return res
    }

    public Separator(...colspans: number[]): AsciiTable
    {
        if (this.nextCol > 0)
            this.Newline();

        for (var colspan of colspans)
        {
            var width = this.nChars(this.nextCol, colspan);
            this._AddCell(AsciiTable.HYPHENS.substr(0, width), colspan, "-+-");
        }

        this._Newline("-+");

        return this;
    }

    public toString(): string
    {
        return this.res;
    }
}
