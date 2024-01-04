class LIconLabel extends LLabel
{
    constructor()
    {
        super();
    }

    get Icon()
    {
        return this._icon.Icon;
    }

    set Icon(value)
    {
        this._icon.Icon = value;
    }

    onIconClick(){}

    _onIconClick()
    {
        this.onIconClick(this.Text);
    }

    _onSizeChanged(width, height)
    {
        console.log("Here");
        this._label.style.width = (this._child.LWidth - (height / 100) * 96);// + "))";// (width - (height / 100) * 90)+"px";
        this._icon.style.width = ((height / 100) * 88) + "px";
        this._icon.style.backgroundColor = "var(--primary_color)";
        super._onSizeChanged(width, height);
    }

    _initialize()
    {
        super._initialize();
        super.TextAlign = "middleLeft";
    }

    _updateContents()
    {
        this.attrbs["icon"] = (value) => { this._onIconValueChanged(value); };
        this.style.borderRadius = "100px";
        this._child.style.display = "flex";
        this._label.style.width = "75%";
    }

    _onIconValueChanged(value)
    {
        this.Icon = value;
    }

    _attachContents()
    {
        super._attachContents();
        this._updateContents();
        this._icon = new LIcon();
        this._icon.className = "l-clickable";
        this._icon.style.margin = ".6%";
        this._icon.style.width = "26%";
        this._icon.style.height = "94%";
        this._icon.style.borderRadius = "inherit";
        this._icon._icon.style.color = "var(--secondary_color)";
        this._icon.style.position = "relative";
        // this._icon.onmouseover = ()=>{
        //     this._icon._icon.style.color = "var(--secondary_color)";
        // };
        // this._icon.onmouseleave = ()=>{
        //     this._icon._icon.style.color = "var(--primary_color)";
        // };
        this._icon.onclick = () => { this._onIconClick(); };
        LAnimation.AttachRipple(this._icon);
        this._child.style.backgroundColor = "var(--secondary_color)";
        this._child.appendChild(this._icon);
    }


    static get observedAttributes()
    {
        return ["icon"].concat(LLabel.observedAttributes);
    }
}

customElements.define("l-icon-label", LIconLabel);