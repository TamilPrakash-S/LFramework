class LActiveButton extends LCard
{
    constructor()
    {
        super();
    }

    get IsActive()
    {
        return this.getAttribute("isactive");
    }

    set IsActive(val)
    {
        this.setAttribute("isactive", val);
    }

    get IsVisible()
    {
        return this.getAttribute("isvisible");
    }

    set IsVisible(val)
    {
        this.setAttribute("isvisible", val);
    }

    _initialize()
    {
        this.activeBtnWidth = 5;
        let text = super.innerHTML;
        super.innerHTML = "";
        this.attrbs.isvisible = (val) => { this._onVisibleValChange(val); };
        this.attrbs.isactive = (val) => { this._onActiveValChange(val); };
        super._initialize();
        this._attachElements();
        this._label.Text = text;
        this.style.color = "var(--primary_color)";
    }

    _attachElements()
    {
        this.style.borderRadius = "5px";
        this.style.position = "relative";
        this._label = new LLabel();
        this._label.style.fontWeight = "bold";
        this._label.style.width = "100%";
        this._label.style.fontSize = "inherit";
        this._label.style.color = "inherit";
        this._highlightCtrl = new LDiv();
        this._highlightCtrl.className = "hightlighter";
        this._highlightCtrl.style.background = "var(--primary_color)";
        this._highlightCtrl.style.display = "none";
        this._highlightCtrl.style.position = "absolute";
        this._highlightCtrl.style.right = "0px";
        this._highlightCtrl.style.height = "100%";
        this._highlightCtrl.style.width = this.activeBtnWidth + "px";
        this._highlightCtrl.style.borderTopRightRadius = "inherit";
        this._highlightCtrl.style.borderBottomRightRadius = "inherit";
        this._body.style.display = "flex";
        this._body.style.position = "relative";
        // this._container.style.border = "1px solid rgba(var(--rgbVal), .02)";
        LAnimation.AttachRipple(this._body, "rgba(var(--rgbVal), .2)");
        this._body.appendChild(this._label);
        this._body.appendChild(this._highlightCtrl);
    }

    _onActiveValChange(val)
    {
        if (!this.IsActive || this.IsActive === "false")
        {
            this._highlightCtrl.style.display = "none";
        }
        else
        {
            this._highlightCtrl.style.display = "block";
        }
    }

    _onVisibleValChange(val)
    {
        if (!this.IsVisible || this.IsVisible === "false")
        {
            this.style.visibility = "hidden";
        }
        else
        {
            this.style.visibility = "inherit";
        }
    }

    static get observedAttributes()
    {
        return ["isvisible", "isactive"].concat(LCard.observedAttributes);
    }
}

customElements.define("l-active-button", LActiveButton);