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
        this.innerHTML = '<div class="lloader"><div class="lface lface1"><div class="lcircle"></div></div><div class="lface lface2"><div class="lcircle"></div></div>';
    }
}
window.document.styleSheets[0].insertRule(".lloaderbg{margin: 0;padding: 0;background: #00000050;}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".lloader{position: absolute;top: 50%;left: 50%;transform: translate(-50% , -50%);width: 75px;height: 75px;box-sizing: border-box;}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".lloader .lface{ position: absolute;border: 2px solid #fff;}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".lloader .lface.lface1{top: 0;left: 0;right: 0;bottom: 0;}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".lloader .lface.lface2{top: 20px;left: 20px;right: 20px;bottom: 20px;}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".lloader .lface{border-radius: 50%;box-shadow: 0 0 10px rgba(0,0,0,.5);animation: lrotate 1.5s linear infinite;}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".lloader .lface.lface2{animation: lrotate 1s reverse linear infinite;}", window.document.styleSheets[0].cssRules.length);
// window.document.styleSheets[0].insertRule(".lloader .lface.lface1{border-top: 2px solid var(--primary_color);}", window.document.styleSheets[0].cssRules.length);
// window.document.styleSheets[0].insertRule(".lloader .lface.lface2{border-right: 2px solid var(--primary_color);border-bottom: 2px solid (--primary_color);}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".lloader .lface .lcircle{position: absolute;top: calc(50% - 1px);left: 50%;width: 50%;height: 2px;transform-origin: left;transform: rotate(-45deg);}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".lloader .lface .lcircle:before{content: '';position: absolute;width: 10px;height: 10px;border-radius: 50%;top: -4px;right: -6px;background: var(--primary_color);box-shadow: 0 0 2px var(--primary_color), 0 0 0 1px rgba(var(--rgbVal),.1);}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("@keyframes lrotate{0%{transform: rotate(0deg);}100%{transform: rotate(360deg);}}", window.document.styleSheets[0].cssRules.length);

customElements.define("l-loader", LLoader);