class LSwitch extends LDiv
{
    constructor()
    {
        super();
    }

    get Checked()
    {
        return this.getAttribute('checked') === "true";
    }

    set Checked(value)
    {
        this.setAttribute('checked', value);
    }

    CheckChanged() { };

    onclick(e)
    {
        this.Checked = !this.Checked;
        e.preventDefault();
        e.stopImmediatePropagation();
    }

    _initialize()
    {
        this.attrbs.checked = (val) => { this._onCheckChanged(val); };
        this._attachElements();
        super._initialize();
    }

    _attachElements()
    {
        this._circle = new LDiv();
        this._circle.className = "circle";
        this._bg = new LDiv();
        this._bg.className = "bg";
        this.appendChild(this._bg);
        this.appendChild(this._circle);
    }

    _onCheckChanged(value)
    {
        if (value === "true")
        {
            this.classList.add("checked");
            this._circle.style.transform = "translate(" + (this._bg.LWidth - (this._bg.LHeight)) + "px, 0px)";
        }
        else 
        {
            this.classList.remove("checked");
            this._circle.style.transform = "translate(0, 0)";
        }
        this.CheckChanged(this, this.Checked);
    }

    _onSizeChanged(width, height)
    {
        this._circle.style.width = this._circle.LHeight+"px";
        super._onSizeChanged();
    }

    static get observedAttributes()
    {
        return ['checked'].concat(LDiv.observedAttributes);
    }
}
window.document.styleSheets[0].insertRule("l-switch{position: relative;}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("l-switch .bg{box-shadow:0px 0px 3px 0px rgba(0,0,0,0.75);position: absolute;border:1px solid var(--secondary_color);left: -5px;top: -5px;background-color: var(--gray);height: 100%;width: 100%;transition: background-color 0.15s ease-out 0.1s;border-radius: 10000px;}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("l-switch .circle{box-shadow: 0 0.0625em 0.375em 0 #666;position: absolute;box-shadow:0px 0px 1px 0px rgba(0,0,0,0.75);border-radius: 50%;background-color: var(--secondary_color);transform: translate(0, 0);transition: transform 0.15s ease-out 0.1s;height: calc(100% - 8px);}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("l-switch.checked .bg{background: var(--primary_color);}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("l-switch th.desc:after{border-width: 4px 4px 0px;display:block}", window.document.styleSheets[0].cssRules.length);

customElements.define("l-switch", LSwitch);