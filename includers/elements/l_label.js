class LLabel extends LDiv
{
    constructor()
    {
        super();
    }

    get TextAlign()
    {
        return this.getAttribute("text-align");
    }

    set TextAlign(val)
    {
        return this.setAttribute("text-align", val);
    }

    get Text()
    {
        return this.innerHTML;
    }

    set Text(val)
    {
        this.innerHTML = val;
    }

    get innerHTML()
    {
        return this._label.innerHTML;
    }

    set innerHTML(value)
    {
        this._label.innerHTML = value;
    }

    _initialize()
    {
        this.attrbs['text-align'] = (value) => { this._onTextAlignChanged(value); };
        let content = super.innerHTML;
        super.innerHTML = "";
        this._attachLabel();
        this._label.innerHTML = content;
        if (!this.getAttribute("text-align")) this.setAttribute("text-align", "middlecenter");
        super._initialize();
    }

    _onTextAlignChanged(value)
    {
        this._updateControl();
    }

    _updateControl()
    {
        let MINPAD = 2;
        let isEmpty = this._label.innerHTML === "";
        if (isEmpty) this._label.innerHTML = "Text";
        this._label.style.paddingTop = MINPAD;
        this._label.style.paddingLeft = MINPAD;
        switch (this.TextAlign.toLowerCase())
        {
            case "topleft":
                this._label.style.textAlign = "center";
                this._label.style.paddingTop = MINPAD;
                break;
            case "topcenter":
                this._label.style.textAlign = "center";
                break;
            case "topright":
                break;
            case "middlecenter":
                this._label.style.textAlign = "center";
                this._label.style.paddingTop = (this.LHeight - this._label.LHeight) / 2;
                break;
            case "middleleft":
                this._label.style.textAlign = "left";
                this._label.style.paddingTop = (this.LHeight - this._label.LHeight) / 2;
                break;
            case "bottomcenter":
                this._label.style.textAlign = "center";
                this._label.style.paddingTop = this.LHeight - this._label.LHeight;
                break;
            case "bottomleft":
                this._label.style.textAlign = "left";
                this._label.style.paddingTop = this.LHeight - this._label.LHeight;
                break;
        }
        if (isEmpty) this._label.innerHTML = "";
    }

    _attachLabel()
    {
        this.style.color = "var(--primary_color)";
        this._label = new LDiv();
        this._label.style.fontWeight = "inherit";
        this._label.style.color = "inherit";
        this._label.style.fontWeight = "inherit";
        this._label.style.fontSize = "inherit";
        this._label.style.textAlign = "center";

        this.appendChild(this._label);
    }

    _onSizeChanged(width, height)
    {
        this._updateControl();
        // super._onSizeChanged(width, height, false);
    }

    static get observedAttributes()
    {
        return ["text-align"].concat(LDiv.observedAttributes);
    }
}

customElements.define("l-label", LLabel);