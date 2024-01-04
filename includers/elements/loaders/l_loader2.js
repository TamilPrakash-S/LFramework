class LLoader extends LDiv
{
    constructor()
    {
        super();
    }

    get Active()
    {
        return this.getAttribute("active");
    }

    set Active(val)
    {
        this.setAttribute("active", val);
    }

    Show()
    {
        this.style.display = 'block';
    }

    Hide()
    {
        this.style.display = 'none';
    }

    _onActiveValChanged(val)
    {
        if (val && val === "true") this.Show();
        else this.Hide();
    }

    _initialize()
    {
        this.className = "lloaderbg";
        this.style.zIndex = 1000;
        this.style.height = "100%";
        this.style.width = "100%";
        this.style.position = "absolute";
        if(!this.Active) this.Hide();
        this.attrbs["active"] = (val) => { this._onActiveValChanged(val); };
        this._attachElements();
        super._initialize();
    }

    _attachElements()
    {
        this.innerHTML = '<div class="lloader"></div>';
    }
}
window.document.styleSheets[0].insertRule(".lloaderbg{margin: 0;padding: 0;background: #000000a0;}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".lloader{position: absolute;top: 50%;left: 50%;transform: translate(-50% , -50%);}", window.document.styleSheets[0].cssRules.length);

window.document.styleSheets[0].insertRule(".lloader{border-radius: 50%;content: '';"
                                          +"width: 25px;height: 25px;border: solid 1em;"+"border-color: var(--primary_color) transparent var(--primary_color)}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".lloader{animation: lrotate 1s linear infinite;}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("@keyframes lrotate{0%{transform: rotate(0deg);}100%{transform: rotate(360deg);}}", window.document.styleSheets[0].cssRules.length);

customElements.define("l-loader", LLoader);