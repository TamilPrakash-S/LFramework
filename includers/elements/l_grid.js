class LGrid extends LDiv
{
    constructor()
    {
        super();
    }

    get Cols()
    {
        return this.getAttribute('cols');
    }

    set Cols(value)
    {
        this.setAttribute('cols', value);
    }

    get ColumnWidth()
    {
        return this.getAttribute("columnWidth");
    }

    set ColumnWidth(value)
    {
        this.style.gridTemplateColumns = "repeat(auto-fill, minmax(" + value + "px, " + value + "px))";
        this.setAttribute("columnWidth", value);
    }

    _initialize()
    {
        this.attrbs.cols = (val) => { this._onColumnValueChanged(val); };
        this.attrbs.columnWidth = (val) => { this._onColumnWidthValueChanged(val); };
        this.style.display = "grid";
        this.style.overflow = 'auto';
        // this.style.gridTemplateColumns = "repeat(auto-fill, minmax(100px, 140px))";
        this.style.padding = "10px";
        super._initialize();
    }

    _onPaginationValueChanged(val)
    {

    }

    _onColumnWidthValueChanged(value)
    {
        this.style.gridTemplateColumns = "repeat(auto-fill, minmax(" + value + "px, " + value + "px))";
    }

    _onColumnValueChanged(val)
    {
        // this.style.gridTemplateColumns = "repeat(auto-fill, minmax(100px, 140px))";
        this.style.gridTemplateColumns = "repeat("+val+", 1fr)";
    }

    static get observedAttributes()
    {
        return ['cols', 'columnWidth'].concat(LDiv.observedAttributes);
    }
}
customElements.define("l-grid", LGrid);