class LButton extends LDiv
{
    constructor()
    {
        super();
    }

    get innerHTML()
    {
        return this._label.innerHTML;
    }

    set innerHTML(val)
    {
        this._label.innerHTML = val;
    }

    // appendChild(element)
    // {
    //     this._container.appendChild(element);
    // }

    _initialize()
    {
        let html = super.innerHTML;
        super._initialize();
        super.innerHTML = "";
        this._attachElements();
        this._label.innerHTML = html;
    }

    _attachElements()
    {
        if (!this.style.position) this.style.position = "relative";
        if (!this.style.width) this.style.width = "150px";
        if (!this.style.height) this.style.height = "75px";
        if (!this.style.borderRadius) this.style.borderRadius = "8px";
        if (!this.style.color) this.style.color = "var(--primary_color)";
        if (!this.style.backgroundColor) this.style.backgroundColor = "var(--secondary_color)";
        if (!this.style.fontWeight) this.style.fontWeight = "bolder";
        if (!this.style.border) this.style.border = "1px solid rgba(var(--shadow_color_rgb), 0.1)"
        if (!this.style.boxShadow) this.style.boxShadow = "0px 1px 10px 3px var(--shadow_color)";
        LAnimation.AttachRipple(this, "rgba(var(--rgbVal), .2)");

        // this._container = new LDiv();
        // this._container.style.boxShadow = "0 4px 5px 0 var(--shadow_color)," +
        //     "0 1px 10px 0 var(--shadow_color)," +
        //     "0 2px 2px -1px var(--shadow_color)";
        // this._container.style.background = "inherit";
        // this._container.style.borderRadius = "inherit";
        // this._container.style.position = "relative";
        // this._container.style.margin = "5%";
        // this._container.style.width = "90%";
        // this._container.style.height = "90%";
        // this._container.style.fontSize = "inherit";

        this._label = new LLabel();
        this._label.style.height = "100%";
        this._label.style.userSelect = "none";
        this._label.style.width = "100%";
        this._label.style.color = "inherit";
        this._label.style.fontSize = "inherit";

        super.appendChild(this._label);
    }
}

customElements.define("l-button", LButton);