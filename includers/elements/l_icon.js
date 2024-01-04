class LIcon extends LDiv
{
    constructor()
    {
        super();
    }

    get Icon()
    {
        return this._icon.innerHTML; 
    }

    set Icon(val)
    {
        this._icon.innerHTML = val;
    }

    _initialize()
    {
        this.attrbs["icon"] = (value)=>{this._onIconValueChanged(value);};
        let innerText = this.innerHTML;
        this.innerHTML = "";
        this._attachIcon();
        this._icon.innerHTML = innerText;
        super._initialize();
    }

    _onIconValueChanged(value)
    {
        this.Icon = value;
    }

    _attachIcon()
    {
        this._icon = document.createElement("i");
        this._icon.className = "icons";
        this._icon.style.fontSize = "170%";
        this._icon.style.color = "var(--primary_color)";
        this._icon.style.textAlign = "center";
        this._icon.style.userSelect = "none";
        this._icon.style.width = "100%";
        this.appendChild(this._icon);
    }

    _onSizeChanged(width, height)
    {
        this._icon.style.marginTop = (height - this._icon.LHeight) / 2;
        // this._icon.style.marginLeft = (width - this._icon.LWidth) / 2;
        super._onSizeChanged(width, height);
    }
    
    static get observedAttributes()
    {
        return ["icon"].concat(LDiv.observedAttributes);
    }
}


customElements.define("l-icon", LIcon);