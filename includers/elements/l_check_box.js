class LCheckBox extends LDiv {
    constructor() {
        super();
    }

    get Checked() {
        return this.getAttribute('checked') === "true";
    }

    set Checked(value) {
        if (value === true) this.setAttribute('checked', "true");
        else this.setAttribute('checked', "false");
    }

    onclick(e) {
        this.Checked = !this.Checked;
        e.preventDefault();
        e.stopImmediatePropagation();
    }

    _initialize() {
        this.CheckChanged = undefined;
        this.attrbs.checked = (val) => { this._onCheckChanged(val); };
        this._attachIcon();
        super._initialize();
    }

    _attachIcon() {
        this._icon = document.createElement("i");
        this._icon.className = "icons";
        this._icon.style.fontSize = "170%";
        this._icon.style.color = "var(--gray)";
        this._icon.style.userSelect = "none";
        this._icon.innerHTML = LCheckBox.UnCheckedIcon;
        this.appendChild(this._icon);
    }

    _onSizeChanged(width, height) {
        this._icon.style.marginTop = (height - this._icon.LHeight) / 2;
        this._icon.style.marginLeft = (width - this._icon.LWidth) / 2;
        super._onSizeChanged(width, height)
    }

    _onCheckChanged(value) {
        if (this.CheckChanged) {
            this.CheckChanged(this, this.Checked);
        }
        if (value === "true") {
            this._icon.style.color = "var(--primary_color)";
            this._icon.innerHTML = LCheckBox.CheckedIcon;
        }
        else {
            this._icon.style.color = "var(--gray)";
            this._icon.innerHTML = LCheckBox.UnCheckedIcon;
        }
    }

    static get observedAttributes() {
        return ['checked'].concat(LDiv.observedAttributes);
    }

    static get CheckedIcon() {
        return "check_circle_outline";
    }

    static get UnCheckedIcon() {
        return "check_circle_outline";
    }
}


customElements.define("l-check-box", LCheckBox);