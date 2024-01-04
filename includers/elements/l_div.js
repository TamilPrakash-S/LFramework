class LDiv extends HTMLElement
{
    constructor()
    {
        super();
        this._cVisible = this.style.visibility;
        // this.style.visibility = "hidden";
        if(!this.style.display) this.style.display = "block";
        this.style.alignContent = "middle";
        this.attrbs = {};
        this.addEventListener("click", (e)=>{this.onclick(e);});

        this._initialize();
    }

    // get innerHTML()
    // {
    //     return super.innerHTML;
    // }

    // set innerHTML(val)
    // {
    //     //Ignored
    // }

    Refresh()
    {
        this._onSizeChanged(this.LWidth, this.LHeight);
    }

    onclick(e)
    {
       
    }

    ondblclick(e)
    {

    }

    _initialize()
    {
        // this.innerHTML = "";
        this._initializeSizeWatcher();
    }

    _onSizeChanged(width, height, ignoreSizeWatchClear)
    {
        this.style.visibility = this._cVisible;
        if(!ignoreSizeWatchClear) this._clearSizeWatcher();
    }

    attributeChangedCallback(name, oldValue, newValue)
    {
        this.attrbs[name](newValue);
    }

    static get observedAttributes()
    {
        return [];
    }
}

customElements.define("l-div", LDiv);