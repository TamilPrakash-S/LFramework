class LSplit extends LDiv
{
    constructor()
    {
        super();
    }

    _initialize()
    {
        this.style.height = "100%";
        this.style.width = "2px";
        this._attachElements();
    }

    _attachElements()
    {
        this._line = new LDiv();
        this._line.className = "line";
        this._line.style.width = "100%";
        this._line.style.marginTop = "5px";
        this._line.style.height = "calc(100% - 10px)";
        this._line.style.borderLeft = "1px solid var(--gray)";
        this.appendChild(this._line);
    }
}

customElements.define("l-split", LSplit);