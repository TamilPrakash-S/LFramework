Object.defineProperty(HTMLElement.prototype, "removeClass", {
    value: function removeClass(name)
    {
        let classes = this.className.split(" ");
        let className = "";
        for (let i = 0; i < classes.length; i++)
        {
            classes[i] = classes[i].trim();
            if (name !== classes[i]) className += classes[i];
            if (i !== classes.length - 1) className += " ";
        }
        this.className = className.trim();
    }
});

Object.defineProperty(HTMLElement.prototype, "addClass", {
    value: function addClass(name)
    {
        if (!this.className || this.className === "") this.className = name;
        else
        {
            this.removeClass(name);
            this.className += " " + name.trim();
        }
        this.className = this.className.trim();
    }
});

Object.defineProperty(HTMLElement.prototype, "containsClass", {
    value: function containsClass(name)
    {
        let classes = this.className.split(" ");
        for (let i = 0; i < classes.length; i++)
        {
            if (name === classes[i]) return true;
        }
        return false;
    }
});

Object.defineProperty(HTMLElement.prototype, "SetVisiblity", {
    value: function SetVisiblity(visiblity, defaultValue = "block")
    {
        this.style.display = visiblity ? defaultValue : "none";
    }
});

Object.defineProperty(HTMLElement.prototype, "LWidth", {
    get: function ()
    {
        return this.offsetWidth;
    },
});

Object.defineProperty(HTMLElement.prototype, "LHeight", {
    get: function ()
    {
        return this.offsetHeight;
    },
});

Object.defineProperty(HTMLElement.prototype, "LSize", {
    get: function ()
    {
        return { "Width": this.offsetWidth, "Height": this.offsetHeight };
    },
});


Object.defineProperty(HTMLElement.prototype, "_initializeSizeWatcher", {
    value: function ()
    {
        this._resizer =
        {
            "lastWidth": 0,
            "lastHeight": 0,
        }
        this._resizer.interval = setInterval(() =>
        {
            if (this.offsetWidth !== this._resizer.lastWidth || this.offsetHeight !== this._resizer.lastHeight)
            {
                this._resizer.lastWidth = this.offsetWidth;
                this._resizer.lastHeight = this.offsetHeight;
                if (this._onSizeChanged) this._onSizeChanged(this._resizer.lastWidth, this._resizer.lastHeight);
            }
        }, 100);
    }
});

Object.defineProperty(HTMLElement.prototype, "_clearSizeWatcher", {
    value: function ()
    {
        clearInterval(this._resizer.interval);
    }
});

Array.prototype.remove = function ()
{
    var what, a = arguments, L = a.length, ax;
    while (L && this.length)
    {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1)
        {
            this.splice(ax, 1);
        }
    }
    return this;
};

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

class LCard extends LDiv
{
    constructor()
    {
        super();
    }

    get FooterVisible()
    {
        return this.getAttribute("footervisible");
    }

    set FooterVisible(val)
    {
        this._updateFooter();
        return this.setAttribute("footervisible", val);
    }

    get HeaderVisible()
    {
        return this.getAttribute('headervisible');
    }

    set HeaderVisible(val)
    {
        this._updateHeader();
        return this.setAttribute('headervisible', val);
    }

    get Footer()
    {
        return this._footer;
    }

    get Header()
    {
        return this._header;
    }

    get Body()
    {
        return this._body;
    }

    get innerHTML()
    {
        if (undefined == this._body) return super.innerHTML;
        return this._body.innerHTML;
    }

    get Width()
    {
        return this.getAttribute("width");
    }

    set Width(val)
    {
        this.setAttribute("width", val);
    }

    get Height()
    {
        return this.getAttribute("height");
    }

    set Height(val)
    {
        this.setAttribute("height", val);
    }

    set innerHTML(value)
    {
        if (undefined == this._body) super.innerHTML = value;
        else this._body.innerHTML = value;
    }

    append(node)
    {
        this._body.append(node);
    }

    appendChild(node)
    {
        this._body.appendChild(node);
    }

    _initialize()
    {
        this._headerHeight = 10;
        this._footerHeight = 10;
        this.attrbs["footervisible"] = (val) => { this._onFooterVisibleChanged(val); };
        this.attrbs["headervisible"] = (val) => { this._onHeaderVisibleChanged(val); };
        this.attrbs.width = (val) => { this._onWidthChanged(val); };
        this.attrbs.height = (val) => { this._onHeightChanged(val); };
        let content = super.innerHTML;
        super.innerHTML = "";
        this.borderRadius = "10px";
        this._attachContainer();
        this._attachHeader();
        this._attachBody();
        this._attachFooter();
        this._body.innerHTML = content;
        super._initialize();
        this._updateFooter();
        this._updateHeader();
    }

    _onFooterVisibleChanged(val)
    {
        this._updateFooter();
    }

    _onHeaderVisibleChanged(val)
    {
        this._updateHeader();
    }

    _onWidthChanged(val)
    {
        this.style.width = val;
    }

    _onHeightChanged(val)
    {
        this.style.height = val;
    }

    _attachBody()
    {
        this._body = new LDiv();
        this._body.style.borderRadius = "inherit";
        this._body.style.width = "100%";
        // this._body.style.overflow = "auto";
        this._body.style.height = (100 - this._headerHeight - this._footerHeight) + "%";

        this._container.appendChild(this._body);
    }

    _attachContainer()
    {
        this.style.borderRadius = "10px";
            // this.style.backgroundColor = "var(--secondary_color)";

        this._container = new LDiv();
        this._container.style.boxShadow = "0 0 8px #00000020, 0 4px 5px 0 var(--shadow_color)," +
            "0 1px 8px 0 var(--shadow_color)," +
            "0 2px 2px -1px var(--shadow_color)";
            this._container.style.boxShadow = "0 0 10px #00000025";
        this._container.style.margin = "5px";
        this._container.style.backgroundColor = "var(--secondary_color)";
        this._container.style.borderRadius = this.borderRadius;
        // this._container.style.position = "relative";
        this._container.style.width = "calc(100% - 10px)";
        this._container.style.height = "calc(100% - 10px)";
        this._container.style.borderRadius = "inherit";

        super.appendChild(this._container);
    }

    _attachHeader()
    {
        this._header = new LDiv();
        this._header.style.height = this._headerHeight + "%";
        this._header.style.borderTopRightRadius = this.borderRadius;
        this._header.style.borderTopLeftRadius = this.borderRadius;
        this._header.style.padding = "1%";
        this._header.style.verticalAlign = "top";
        this._header.style.borderBottom = "2px solid #00000009";
        this._header.style.display = "flex";
        this._container.appendChild(this._header);
    }

    _attachFooter()
    {
        this._footer = new LDiv();
        this._footer.style.height = this._footerHeight + "%";
        this._footer.style.position = "absolute";
        this._footer.style.left = 0;
        this._footer.style.bottom = 0;
        this._footer.style.width = "100%";
        this._footer.style.borderBottomRightRadius = this.borderRadius;
        this._footer.style.borderBottomLeftRadius = this.borderRadius;
        this._footer.style.borderTop = "2px solid #00000005";

        this._container.appendChild(this._footer);
    }

    _updateBodyHeight()
    {
        if (!this.HeaderVisible || this.HeaderVisible === "false")
        {
            if (!this.FooterVisible || this.FooterVisible === "false")
            {
                this._body.style.height = "100%";
            }
            else
            {
                this._body.style.height = (100 - this._footerHeight) + "%";
            }
        }
        else if (!this.FooterVisible || this.FooterVisible === "false")
        {
            this._body.style.height = (100 - this._headerHeight) + "%";
        }
        else
        {
            this._body.style.height = (100 - this._headerHeight - this._footerHeight) + "%";
        }
    }

    _updateHeader()
    {
        if (!this.HeaderVisible || this.HeaderVisible === "false")
        {
            this._header.style.display = "none";
        }
        else
        {
            this._header.style.display = "flex";
        }
        this._updateBodyHeight();
    }

    _updateFooter()
    {
        if (!this.FooterVisible || this.FooterVisible === "false")
        {
            this._footer.style.display = "none";
        }
        else
        {
            this._footer.style.display = "flex";
        }
        this._updateBodyHeight();
    }

    static get observedAttributes()
    {
        return ['width', 'height', 'footervisible', 'headervisible'].concat(LDiv.observedAttributes);
    }
}
customElements.define("l-card", LCard);

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

class LDatePicker extends LDiv
{
    constructor()
    {
        super();
    }

    get Iniline()
    {
        return this.getAttribute("inline") === "true";
    }

    set Iniline(val)
    {
        this.setAttribute("inline", val);
    }

    get IsRange()
    {
        return this.getAttribute("isrange") === "true";
    }

    set IsRange(val)
    {
        this.setAttribute("isrange", val);
    }

    _updateDate()
    {

    }

    _attachMonthDiv()
    {
        this._monthHolder = new LGrid();
        this._monthHolder.style.height = "80%";
        this._monthHolder.style.width = "98%";
        this._monthHolder.Cols = 7;
        this._datesLabels = [];
        for (let i = 0; i < 42; i++)
        {
            let label = new LLabel();
            label.style.fontWeight = "bold";
            label.style.borderRadius = "50%";
            label.onmouseover = () => { label.style.backgroundColor = "var(--primary_color)"; label.style.color = "var(--secondary_color)"; };
            label.onmouseleave = () => { label.style.backgroundColor = "var(--secondary_color)"; label.style.color = "var(--primary_color)"; };
            label.Text = i + 1;
            this._monthHolder.appendChild(label);
            this._datesLabels.push(label);
        }


        this._holder.appendChild(this._monthHolder);
    }

    _attachMainHolder()
    {
        this._holder = new LDiv();
        this.appendChild(this._holder);
    }

    _onSizeChanged(width, height)
    {
        for (let i = 0; i < this._datesLabels.length; i++) this._datesLabels[i].Refresh();
        for (let i = 0; i < this._datesLabels.length; i++) this._datesLabels[i].Refresh();
        super._onSizeChanged(width, height);
    }

    _initialize()
    {
        this.style.width = "270px";
        this.style.height = "300px";
        this.attrbs["iniline"] = () => { }; //TODO
        this.attrbs["isrange"] = () => { }; //TODO
        let today = new Date();
        this._today = { Date: today.getDate(), Month: today.getMonth(), Year: today.getFullYear() };

        this._currentDate = { Date: today.getDate(), Month: today.getMonth(), Year: today.getFullYear() };
        this._selectedDate = [{ Date: -1, Month: -1, Year: -1 }, { Date: -1, Month: -1, Year: -1 }];
        this._attachMainHolder();
        this._attachMonthDiv()
        super._initialize();
    }

    static get observedAttributes()
    {
        return ['inline', 'isrange'].concat(LDiv.observedAttributes);
    }
}
customElements.define("l-datepicker", LDatePicker);

class LGrid extends LDiv
{
    constructor()
    {
        super();
    }

    get Cols()
    {
        return this.getAttribute('cols');
    }

    set Cols(value)
    {
        this.setAttribute('cols', value);
    }

    get ColumnWidth()
    {
        return this.getAttribute("columnWidth");
    }

    set ColumnWidth(value)
    {
        this.style.gridTemplateColumns = "repeat(auto-fill, minmax(" + value + "px, " + value + "px))";
        this.setAttribute("columnWidth", value);
    }

    _initialize()
    {
        this.attrbs.cols = (val) => { this._onColumnValueChanged(val); };
        this.attrbs.columnWidth = (val) => { this._onColumnWidthValueChanged(val); };
        this.style.display = "grid";
        this.style.overflow = 'auto';
        // this.style.gridTemplateColumns = "repeat(auto-fill, minmax(100px, 140px))";
        this.style.padding = "10px";
        super._initialize();
    }

    _onPaginationValueChanged(val)
    {

    }

    _onColumnWidthValueChanged(value)
    {
        this.style.gridTemplateColumns = "repeat(auto-fill, minmax(" + value + "px, " + value + "px))";
    }

    _onColumnValueChanged(val)
    {
        // this.style.gridTemplateColumns = "repeat(auto-fill, minmax(100px, 140px))";
        this.style.gridTemplateColumns = "repeat("+val+", 1fr)";
    }

    static get observedAttributes()
    {
        return ['cols', 'columnWidth'].concat(LDiv.observedAttributes);
    }
}
customElements.define("l-grid", LGrid);

class LLabel extends LDiv
{
    constructor()
    {
        super();
    }
    
    connectedCallback() {}

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

class LToast extends LDiv
{
    constructor()
    {
        super();
    }

    _initialize()
    {
        this._attachBody();
        super._initialize();
    }

    _attachBody()
    {
        let borderRadius = "5px";
        this.style.zIndex = "10000000";
        this.style.position = "absolute";
        this.style.height = LToast.DefaultHeight;
        this.style.width = "300px";
        this.style.bottom = "100px";
        this.style.left = "calc(50vw - 150px)";
        this.style.animationDuration = "5s";
        this.style.animationFillMode = "both";
        this._body = new LCard();
        this._body.style.height = "100%";
        this._body.style.width = "100%";
        this.appendChild(this._body);

        this._cardBody = new LDiv();
        this._cardBody.style.height = "100%";
        this._cardBody.style.width = "100%";
        this._cardBody.style.display = "flex";
        this._cardBody.style.borderRadius = borderRadius;
        this._body.appendChild(this._cardBody);

        this._leftHighlighter = new LDiv();
        this._leftHighlighter.style.borderTopLeftRadius = borderRadius;
        this._leftHighlighter.style.borderBottomLeftRadius = borderRadius;
        this._leftHighlighter.style.width = "5px";
        this._leftHighlighter.style.height = "100%";
        this._leftHighlighter.style.backgroundColor = "var(--primary_color)";
        this._cardBody.appendChild(this._leftHighlighter);

        this._label = new LLabel();
        this._label.style.margin = "5px";
        this._label.Text = "Message";
        this._label.style.fontWeight = "bold";
        this._cardBody.appendChild(this._label);
    }

    static Show(type, message, duration, width, height)
    {
        if (!message) return;
        if (!duration) duration = LToast.DefaultDuration;
        if(!width) width = LToast.DefaultWidth;
        if(!height) height = LToast.DefaultHeight;
        LToast.Instance.style.height = height;
        LToast.Instance.style.width = width;
        switch (type)
        {
            case 1:
                LToast.Instance._leftHighlighter.style.backgroundColor = "var(--primary_color)";
                LToast.Instance._label.style.color = "var(--primary_color)";
                break;
            case 2:
                LToast.Instance._leftHighlighter.style.backgroundColor = "rgb(var(--warnRgb))";
                LToast.Instance._label.style.color = "rgb(var(--warnRgb))";
                break;
            case 3:
                LToast.Instance._leftHighlighter.style.backgroundColor = "rgb(var(--errorRgb))";
                LToast.Instance._label.style.color = "rgb(var(--errorRgb))";
                break;
        }
        LToast.Instance._label.Text = message;
        if (LToast._cTimerOut) clearTimeout(LToast._cTimerOut);
        LAnimation.UnFade(LToast.Instance);
        LToast._cTimerOut = setTimeout(() =>
        {
            LAnimation.Fade(LToast.Instance);
        }, duration);
    }

    static Init()
    {
        if (LToast._isInitialized) return;
        LToast._isInitialized = true;
        LToast.Instance = new LToast();
        document.addEventListener("load", ()=>{document.body.appendChild(LToast.Instance);});
        
        LToast.Instance.style.opacity = "0";
        LToast.DefaultWidth = "300px";
        LToast.DefaultHeight = "80px";
        LToast.DefaultDuration = "1000";
    }
}
customElements.define("l-toast", LToast);
LToast.Init();

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

class LTextBox extends LDiv
{
    constructor()
    {
        super();
    }

    get Placeholder()
    {
        return this.getAttribute("placeholder");
    }

    set Placeholder(value)
    {
        this.setAttribute("placeholder", value);
    }

    get Text()
    {
        return this._input.value;
    } 

    set Text(value)
    {
        this._input.value = value;
    } 

    _initialize()
    {
        this.TextChanged = undefined;
        this.attrbs['placeholder'] = this._onPlaceholderChanged.bind(this);
        this._attachContents();
        super._initialize();
    }

    _onPlaceholderChanged(value)
    {
        this._input.setAttribute("placeholder", value)
    }   

    _onTextChanged()
    {
        if(this.TextChanged) setTimeout(()=>{this.TextChanged()}, 10);
    }

    _attachContents()
    {
        this.style.borderRadius = "5px";
        this._child = new LDiv();
        this._child.style.width = "100%";
        this._child.style.height = "90%";
        this._child.style.borderRadius = "inherit";
        this._child.style.border = "1px solid var(--gray)";
        this.appendChild(this._child);     
        
        this._attachTextBox();
    }

    _attachTextBox()
    {
        this._input = document.createElement('input');
        this._input.onkeydown = ()=>{this._onTextChanged()};
        this._input.oncut = ()=>{this._onTextChanged()};
        this._input.onpaste = ()=>{this._onTextChanged()};
        this._input.className = "lInput";
        this._input.style.width = "97%";
        this._input.style.height = "100%";
        this._input.style.fontSize = "110%";
        this._input.style.paddingLeft = "3%";
        this._input.style.borderRadius = "inherit"; 
        this._input.style.border = "hidden";
        this._input.style.color ="var(--primary_color)";
        this._input.onfocus = ()=>
        {
            this._input.style.outline = "none";
            this._child.style.border = "1px solid var(--primary_color)";
        };

        this._input.onblur = ()=>
        {
            this._child.style.border = "1px solid var(--gray)";
        };
        this._child.appendChild(this._input);
    }

    _onSizeChanged(width, height)
    {
        this._child.style.marginTop = (height * .05) - 2;
        // this._child.style.marginLeft = width * .05;
        super._onSizeChanged(width, height);
    }

    static get observedAttributes()
    {
        return ['placeholder'].concat(LDiv.observedAttributes);
    }
}
window.document.styleSheets[0].insertRule(".lInput::placeholder {color:rgba(var(--rgbVal), .8);}", window.document.styleSheets[0].cssRules.length);
customElements.define("l-textbox", LTextBox);

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

class LIconTextBox extends LTextBox
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

    onIconClick() { }

    _onIconClick()
    {
        this.onIconClick(this.Text);
    }

    _onSizeChanged(width, height)
    {
        this._icon.style.width = this._icon.LHeight + "px";//((height / 100) * 88) + "px";
        this._input.style.width = "calc(100% - " + ((height / 100) * 88) + "px)";
        this._icon.style.backgroundColor = "var(--primary_color)";
        super._onSizeChanged(width, height);
    }

    _initialize()
    {
        super._initialize();
    }

    _updateContents()
    {
        this.attrbs["icon"] = (value) => { this._onIconValueChanged(value); };
        this.style.borderRadius = "100px";
        this._child.style.display = "flex";
        // this._input.style.width = "75%";
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
        this._icon.style.width = "26%";
        this._icon.style.height = "calc(100% - 4px)";
        this._icon.style.margin = "2px";
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
        return ["icon"].concat(LTextBox.observedAttributes);
    }
}
customElements.define("l-icon-textbox", LIconTextBox);

class LKeyValueLabel extends LDiv
{
    constructor()
    {
        super();
    }

    get Key()
    {
        return this.getAttribute('key');
    }

    set Key(value)
    {
        this.setAttribute('key', value);
    }

    get Value()
    {
        return this.getAttribute('value');
    }
    
    set Value(value)
    {
        this.setAttribute('value', value);
    }

    _initialize()
    {
        super._initialize();
        this._attachContainer();
        this._attachKeyLabel();
        this._attachValueLabel();
    }   

    _attachContainer()
    {
        this._container = document.createElement('div');
        this._container.className = "kContainer";
        this._container.style.width = "100%";
        this._container.style.columnCount = 2;
        this._container.style.columnGap = 0;
        this.style.color = "var(--primary_color)";

        this.appendChild(this._container);
    }

    _attachKeyLabel()
    {
        this._keyLabel = new LLabel();
        this._keyLabel.TextAlign = "middleLeft";
        this._keyLabel.innerHTML = this.Key;
        this._keyLabel.style.fontWeight = "1000";
        this._keyLabel.style.color = "inherit";
        this._keyLabel.style.paddingLeft = "5%";
        this._keyLabel.style.fontSize = ".9em";
        this._keyLabel.style.fontSize = "85%";
        this._keyLabel.style.height = "100%";
        
        this._container.appendChild(this._keyLabel);
    }
    
    _attachValueLabel()
    {
        this._valueLabel = new LLabel();
        this._valueLabel.TextAlign = "middleLeft";
        this._valueLabel.innerHTML = this.Value;
        this._valueLabel.style.fontWeight = "bold";
        this._valueLabel.style.fontWeight = "300";
        this._valueLabel.style.color = "inherit";
        this._valueLabel.style.fontSize = ".9em";
        this._valueLabel.style.fontSize = "85%";
        this._valueLabel.style.height = "100%";
        this._container.appendChild(this._valueLabel);
    }

    _updatextSize()
    {
        
    }

    _onSizeChanged(width, height)
    {
        
        super._onSizeChanged(width, height);
    }

    attributeChangedCallback(name, oldValue, newValue)
    {
        switch(name)
        {
            case 'key':
                this._keyLabel.innerHTML = newValue;
                break;
            case 'value':
                this._valueLabel.innerHTML = newValue;
                break;
        }
    }

    static get observedAttributes()
    {
        return ['key', 'value'];
    }
}
customElements.define("l-key-value", LKeyValueLabel);

class LMultiselectCards extends LGrid
{
    constructor() 
    {
        super();
    }

    get CardWidth()
    {
        return this.getAttribute('card-width');
    }

    set CardWidth(val)
    {
        return this.setAttribute('card-width', val);
    }

    get CardHeight()
    {
        return this.getAttribute('card-height');
    }

    set CardHeight(val)
    {
        return this.setAttribute('card-height', val);
    }

    get SelectedIndex()
    {
        let res = [];
        for (let i = 0; i < this.Cards.length; i++)
        {
            if (this.Cards[i].checkBox.Checked) res.push(i);
        }
        return res;
    }

    get Count()
    {
        return this.Cards.length;
    }

    Clear()
    {
        for (let i = 0; i < this.Cards.length; i++)
        {
            this.Cards[i].card.style.display = "none";
        }
    }

    HideCard(index)
    {
        this.Cards[index].card.style.display = "none";
    }

    ShowCard(index)
    {
        this.Cards[index].card.style.display = "block";
    }

    SetSelected(index, val)
    {
        this.Cards[index].checkBox.Checked = val;
    }

    SelectAll()
    {
        for (let i = 0; i < this.Cards.length; i++)
        {
            this.Cards[i].checkBox.Checked = true;
        }
    }

    DeselectAll()
    {
        for (let i = 0; i < this.Cards.length; i++)
        {
            this.Cards[i].checkBox.Checked = false;
        }
    }

    CheckAndAddCard(index, name, body)
    {
        if (!this.Cards[index])
        {
            let card = new LCard();
            card._container.style.boxShadow = "";
            card._container.style.boxShadow = "0 1px 14px 0 rgb(0 0 0 / 10%)";
            // 2px 2px 5px #BABECC!important
            // card._container.style.boxShadow = "0 2px 2px rgba(0, 0, 0, 0.01), 0 4px 4px rgba(0, 0, 0, 0.02), 0 8px 8px rgba(0, 0, 0, 0.03)," +
            //     " 0 18px 18px rgba(0, 0, 0, 0.04),0 28px 28px rgba(0, 0, 0, 0.05), 0 38px 38px rgba(0, 0, 0, 0.06); ";
            // card._container.style.backgroundColor = "var(--cbgColor)";
            // card._container.style.border = "5px solid var(--secondary_color)";
            // card._container.style.boxShadow = "-2px -2px 5px rgba(255, 255, 255, 1)," +
            //     "1px 1px 3px rgba(0, 0, 0, .3)," +
            //     "-1px -1px 3px rgba(0, 0, 0, .3)," +
            //     "2px 2px 5px rgba(0, 0, 0, 0.1) inset," +
            //     "-2px -2px 5px rgba(0, 0, 0, 0.1) inset";
            // card._container.style.borderRadius = "10px";
            card.HeaderVisible = true;
            card.style.margin = "5px";
            card.FooterVisible = false;
            card.style.width = this.CardWidth;
            card.style.height = this.CardHeight;
            this.Cards[index] = this._attachCardHeader(card, index);
            this.Cards[index]["card"] = card;
            this.appendChild(card);
        }
        else this.Cards[index].checkBox.Checked = false;

        this.Cards[index].card.style.display = "block";
        this.Cards[index]['card'].Body.innerHTML = "";
        this.Cards[index]['card'].Body.appendChild(body);
        this.Cards[index]['header'].innerHTML = name;
    }

    _attachCardHeader(card, index)
    {
        let label = new LLabel();
        label.style.fontSize = "1.2em";
        label.style.fontWeight = "1000";
        label.style.width = "85%";
        label.style.height = "100%";
        label.style.lineHeight = "100%";
        label.style.paddingLeft = "3%";
        label.innerHTML = "Label";
        label.TextAlign = "bottomLeft";
        label.TextAlign = "middleLeft";

        let checkBox = new LCheckBox();
        checkBox.CheckChanged = (ele, val) => { this._onSelectedChanged(index, val); };
        checkBox.style.width = "15%";
        checkBox.style.height = "100%";

        card.Header.appendChild(label);
        card.Header.appendChild(checkBox);
        card.onclick = () => { checkBox.Checked = !checkBox.Checked; };
        return { 'header': label, 'checkBox': checkBox };
    }

    _onSelectedChanged(ind, val)
    {
        if (this.SelectedChanged)
        {
            this.SelectedChanged(ind, val);
        }
    }

    _initialize()
    {
        this.SelectedChanged = undefined;
        this.Cards = [];
        this.attrbs['multi-selectable'] = (value) => { this._isMultiselectable(value) };
        this.attrbs['card-width'] = (value) => { this._onCardWidthChanged(value) };
        this.attrbs['card-height'] = (value) => { this._onCardHeightChanged(value) };
        super._initialize();
    }

    _onCardWidthChanged(value)
    {
        for (let i = 0; i < this.Cards.length; i++)
        {
            this.Cards[i].card.Width = value;
        }
    }

    _onCardHeightChanged(value)
    {
        for (let i = 0; i < this.Cards.length; i++)
        {
            this.Cards[i].card.Height = value;
        }
    }

    _isMultiselectable(value)
    {

    }

    static get observedAttributes()
    {
        return ['multi-selectable', 'card-width', 'card-height'].concat(LGrid.observedAttributes);
    }
}
customElements.define("l-multiselect-cards", LMultiselectCards);

class LPagination extends LDiv
{
    constructor()
    {
        super();
    }

    get TotalItems()
    {
        return parseInt(this.getAttribute("totalitems"));
    }

    set TotalItems(val)
    {
        this.setAttribute("totalitems", val);
    }

    get ItemsPerPage()
    {
        return parseInt(this.getAttribute("items-per-page"));
    }

    set ItemsPerPage(val)
    {
        this.setAttribute("items-per-page", val);
    }

    get StartIndex()
    {
        return (this.CurrentPage - 1) * this.ItemsPerPage;
    }

    get CurrentPage()
    {
        return parseInt(this.getAttribute("activepage"));
    }

    set CurrentPage(val)
    {
        this.setAttribute("activepage", val);
    }

    get TotalPages()
    {
        return this._totalPages;
    }

    get DisplayItemsCount()
    {
        if(this.TotalPages === 1) return this.TotalItems;
        if(this.CurrentPage === this.TotalPages)
        {
            let res = this.TotalItems % this.ItemsPerPage;
            return res === 0 ? this.ItemsPerPage : res;
        }
        return this.ItemsPerPage;
    }

    PageChanged() { }

    _initialize()
    {
        this.attrbs["totalitems"] = (val) => { this._update(); };
        this.attrbs["items-per-page"] = (val) =>
        {
            if (val === "-1")
            {
                this.ItemsPerPage = this.TotalItems;
                return;
            }
            this._update();
        };
        this.attrbs["activepage"] = (val) => { this._setSelectedPage(val); };
        this._buttons = [];
        this._prevText = "Prev";
        this._nextText = "Next";
        this._lastActiveBtn = null;
        this._totalPages = 10;
        // this.style.width = "400px";
        // this.style.height = "50px";
        this.style.fontSize = ".9em";
        this.style.color = "var(--primary_color)";
        super._initialize();
        this._attachElements();
        this.CurrentPage = 1;
        this.ItemsPerPage = 10;
        this.TotalItems = 7;
        this._update();
        this._setSelectedPage(1);
    }

    _onItemsPerPageChanged(val)
    {
        this._update();
    }

    _ontotalitemsChanged(val)
    {
        this._update();
    }

    _update()
    {
        this._totalPages = Math.ceil(this.TotalItems / this.ItemsPerPage);
        let i = 1;
        while (i < 8)
        {
            if (i <= this._totalPages)
            {
                if (i === 7)
                {
                    this._setVisible(this._buttons[i], true, this._totalPages);
                } else this._setVisible(this._buttons[i], true, i);
            }
            else break;
            i++;
        }
        let width = (i * 40);
        this._pgButtonsHolder.style.width = (100 + width) + "px";
        while (i < 8)
        {
            this._setVisible(this._buttons[i], false, i);
            i++;
        }
        this.CurrentPage = 1;
    }


    _onBtnClick(btn, ind)
    {
        let currentPage = this.CurrentPage;
        if (ind === 0) currentPage--;
        else if (ind === 9) currentPage++;
        else
        {
            currentPage = parseInt(btn.innerHTML);
        }
        if (currentPage <= 0) currentPage = 1;
        if (currentPage > this.TotalPages) currentPage = this.TotalPages;
        if (currentPage == this.CurrentPage) return;
        this.CurrentPage = currentPage;
    }

    _setActive(btn, val)
    {
        if (!btn) return;
        if (val)
        {
            btn.style.backgroundColor = "var(--primary_color)";
            btn.style.color = "var(--secondary_color)";
        }
        else
        {
            btn.style.backgroundColor = "transparent";
            btn.style.color = "var(--primary_color)";
        }
    }

    _setVisible(btn, val, text)
    {
        btn.innerHTML = text;
        btn.style.display = val ? "block" : "none";
    }

    _setEnabled(btn, val, text)
    {
        if (text) btn.innerHTML = text;
        if (val)
        {
            btn.style.color = "var(--primary_color)";
        }
        else
        {
            btn._label.textAlign = "bottomCenter";
            btn.style.color = "var(--gray)";
        }
    }

    _setSelectedPage(pgNo)
    {
        if (this._totalPages === 0)
        {
            this._setVisible(this._buttons[1], true, 1);
            this._setActive(this._buttons[1], false, 1);
            this._setEnabled(this._buttons[1], false, 1);
            this._setEnabled(this._buttons[8], false, this._nextText);
            this._label.style.visibility = "hidden";
            return;
        }
        this._label.style.visibility = "visible";
        pgNo = parseInt(pgNo);
        this._setActive(this._lastActiveBtn, false);

        for (let i = 1; i < 8; i++)
        {
            this._setActive(this._buttons[i], false);
        }
        if (this.TotalPages <= 7)
        {
            this._setActive(this._buttons[pgNo], true);
        }
        else if (pgNo < 5)
        {
            for (let i = 2; i < 6; i++)
            {
                this._setEnabled(this._buttons[i], true, i);
            }
            this._setEnabled(this._buttons[6], pgNo !== 1, "...");
            this._setActive(this._buttons[pgNo], true);
        }
        else if (pgNo > this.TotalPages - 4)
        {
            this._setEnabled(this._buttons[2], pgNo !== 1, "...");
            for (let i = 6; i >= 3; i--)
            {
                this._setEnabled(this._buttons[i], true, this.TotalPages - (7 - i));
            }
            this._setActive(this._buttons[7 - (this.TotalPages - pgNo)], true);
        }
        else
        {
            this._setEnabled(this._buttons[2], pgNo !== 1, "...");
            this._setEnabled(this._buttons[3], pgNo !== 1, pgNo - 1);
            this._setEnabled(this._buttons[4], pgNo !== 1, pgNo);
            this._setEnabled(this._buttons[5], pgNo !== 1, pgNo + 1);
            this._setEnabled(this._buttons[6], pgNo !== 1, "...");
            this._setActive(this._buttons[4], true);
        }
        this._setEnabled(this._buttons[0], pgNo !== 1, this._prevText);
        this._setEnabled(this._buttons[8], pgNo !== this.TotalPages, this._nextText);
        
        let starVal = 1 + this.StartIndex;

        let itemsInThisPage = this.DisplayItemsCount - 1;
        this._label.Text = "Showing "+starVal+" to "+ (starVal + itemsInThisPage)+" of "+this.TotalItems+".";

        this.PageChanged(this.StartIndex, this.ItemsPerPage);
    }

    _attachElements()
    {
        this.style.position = "relative";
        this._label = new LLabel();
        this._label.style.float = "left";
        this._label.Text = "Showing 5 of 200.";
        this._label.style.fontWeight = "bolder";
        this._label.TextAlign = "bottomCenter";
        this._label.style.marginLeft = "5px";
        this.style.display = "flex";
        this.appendChild(this._label);

        
        this._pgButtonsHolder = new LCard();
        this._pgButtonsHolder.style.position = "absolute";
        this._pgButtonsHolder.style.height = "100%";
        this._pgButtonsHolder.style.width = "400px";
        this._pgButtonsHolder.style.right = "0";
        // this._pgButtonsHolder.style.top = "5px";

        this._container = new LDiv();
        this._container.style.paddingTop = "8px";
        this._container.style.height = "calc(100% - 20px)";
        this._container.style.display = "flex";
        this._container.style.width = "95%";
        this._createButtons();
        this._pgButtonsHolder.appendChild(this._container);
        this.appendChild(this._pgButtonsHolder);


    }

    _createButtons()
    {
        let btn = this._createButton(this._prevText, 0);
        this._container.appendChild(btn);
        this._buttons.push(btn);
        for (let i = 1; i <= 7; i++)
        {
            btn = this._createButton(i, i);
            btn.style.maxWidth = "30";
            this._container.appendChild(btn);
            this._buttons.push(btn);
        }
        btn = this._createButton(this._nextText, 9);
        this._container.appendChild(btn);
        this._buttons.push(btn);
    }

    _createButton(text, ind)
    {
        let btn = new LButton();
        btn.style.backgroundColor = "var(--secondary_color)";
        btn.style.boxShadow = "";
        btn.innerHTML = text;
        btn.style.borderRadius = "5px";
        btn.style.borderWidth = "2px";
        btn.style.borderStyle = "solid";
        btn.style.borderColor = "transparent";
        btn.style.fontWeight = "bolder";
        btn.style.marginLeft = "2%";
        btn.style.color = "inherit";
        btn.style.fontSize = "inherit";
        btn.style.height = "100%";
        btn.style.backgroundColor = undefined;
        btn.onclick = (e) => { if (btn.innerHTML !== "...") this._onBtnClick(btn, ind) };
        return btn;
    }

    static get observedAttributes()
    {
        return ["totalitems", "items-per-page", "activepage"].concat(LCard.observedAttributes);
    }
}
customElements.define("l-pagination", LPagination);

class LSelect extends LDiv
{
    constructor(settings)
    {
        super();
        this.select = null;
        this.display = null;
        this.list = null;
        this.options = [];
        this.isLarge = false;
        this.value = null;
        this.selected = [];
        this.highlighted = null;
        this.selectedIndex = -1;
        this._ulist = undefined;
        this.settings = this.getSettings(settings);
        this.event = document.createEvent("HTMLEvents");
        this.event.initEvent("change", false, true);
        this._init();

    }

    get ShowSelectAll()
    {
        let mulVal = this.getAttribute("show-selectll");
        if (!mulVal) return false;
        return mulVal === "true";
    }

    set ShowSelectAll(value)
    {
        return this.setAttribute("show-selectll", value);
    }

    get MultiSelect()
    {
        let mulVal = this.getAttribute("multiselect");
        if (!mulVal) return false;
        return mulVal === "true";
    }

    set MultiSelect(value)
    {
        return this.setAttribute("multiselect", value);
    }

    get PlaceHolder()
    {
        return this.getAttribute("placeholder");
    }

    set PlaceHolder(value)
    {
        this.setAttribute("placeholder", value);
    }

    get EmptyText()
    {
        return this.getAttribute("emptytext");
    }

    set EmptyText(value)
    {
        return this.setAttribute("emptytext", value);
    }

    GetAllValues()
    {
        if (this._ulist.children.length === 0) return null;
        let data = [];
        for (let i = 0; i < this._ulist.children.length; i++)
            data.push({ value: this._ulist.children[i].getAttribute('data-value'), text: this._ulist.children[i].innerHTML });
        return data;
    }

    GetSelectedOrAllData()
    {
        let data = this.GetSelectedData();
        if (data) return data;
        return this.GetAllValues();
    }

    OnSelectionChanged() { }

    GetSelectedData()
    {
        if (this.selected.length === 0) return null;
        let data = [];
        for (let i = 0; i < this.selected.length; i++)
            data.push({ value: this.selected[i].getAttribute('data-value'), text: this.selected[i].innerHTML });
        return data;
    }

    ShowLoader()
    {
        this.display.classList.add('circleLoader');
    }

    HideLoader()
    {
        this.display.classList.remove('circleLoader');
    }

    SetSelected(value)
    {
        let res = this._ulist.querySelectorAll('[data-value="' + value + '"]');
        if (res) this._setSelectedItem(res[0]);
    }

    Reset()
    {
        this._setSelectedItem(null);
        this.selected = [];
        this._update();
    }

    Clear()
    {
        this._ulist.innerHTML = "";
        this.selected = [];
        this.Reset();
    }

    AddItem(dataValue, text)
    {
        this._addItem(dataValue, text);
        this._update();
    }

    _init()
    {
        this.attrbs['placeholder'] = this._onPlaceholderChanged.bind(this);
        this.buildSelect();
        this.innerHTML = "";
        this.appendChild(this.select);

        document.addEventListener('click', this._handleClickOff.bind(this));
        this.positionList();
    }

    _onPlaceholderChanged(value, oldVal)
    {
        this._update();
    }

    _handleClickOff(e)
    {
        if (!this.select.contains(e.target)) this.closeList();
    }

    buildSelect()
    {
        this.select = new LDiv();
        this.select.classList.add('l-select');
        this.select.setAttribute('tabindex', this.tabIndex);
        this.select.addEventListener('keydown', this.handleSelectKeydown.bind(this));

        this.display = document.createElement('span');
        this.display = new LLabel();
        this.display.TextAlign = "middleLeft";
        this.display.classList.add('value');
        this.display.addEventListener('click', this.handleDisplayClick.bind(this));
        this.select.appendChild(this.display);
        this.buildList();
        if (this.options.length && this.selectedIndex != -1)
        {
            this.value = this.options[this.selectedIndex].getAttribute('data-value');
            setTimeout(()=>{this.OnSelectionChanged()}, 10);
            //this.selected = this.options[this.selectedIndex];
            this.display.innerHTML = this.selected.innerHTML;
        }

        if ((this.settings.filtered === 'auto' && this.options.length >= this.settings.filter_threshold) || this.settings.filtered === true)
        {
            this.isLarge = true;
            this.select.classList.add('large');
        }
    }

    buildList()
    {
        this.list = new LDiv();
        this.list.classList.add('list');
        this.list.setAttribute('tabindex', '-1');
        this.list.addEventListener('keydown', this.handleListKeydown.bind(this));
        this.list.addEventListener('mouseenter', function ()
        {
            if (this.options[this.highlighted]) this.options[this.highlighted].classList.remove('hovered');
        }.bind(this));

        this.highlighted = this.selectedIndex;
        this.buildFilter();
        this.buildOptions();
        this.select.appendChild(this.list);
    }

    buildFilter()
    {
        var wrapper = new LDiv();
        wrapper.classList.add('filter');
        this.filter = document.createElement('input');
        this.filter.type = 'text';
        this.filter.setAttribute('placeholder', this.settings.filter_placeholder);
        this.filter.addEventListener('keyup', this.handleFilterKeyup.bind(this));
        wrapper.appendChild(this.filter);
        this.list.appendChild(wrapper);
    }

    buildOptions()
    {
        this._ulist = document.createElement('ul');
        var options = this.querySelectorAll('option');
        for (var i = 0; i < options.length; i++) this._addItem(options[i].value, options[i].innerHTML);
        this.list.appendChild(this._ulist);
    }

    _addItem(dataValue, text)
    {
        var li = document.createElement('li');
        li.setAttribute('data-value', dataValue);
        li.innerHTML = text;
        li.addEventListener('click', this.handleOptionClick.bind(this));
        this._ulist.appendChild(li);
        this.options.push(li);
    }

    toggleList()
    {
        if (this.list.classList.contains('open'))
        {
            if (this._ulist.children.length == 0) return;
            if (this.display.classList.contains("circleLoader")) return;
            this.list.classList.remove('open');
            this.options[this.highlighted].classList.remove('hovered');
            this.select.focus();
        }
        else
        {
            this.options[this.selectedIndex].classList.add('hovered');
            this.highlighted = this.selectedIndex;
            this.list.classList.add('open');
            this.list.focus();
        }
    }

    positionList()
    {
        if (!this.isLarge && this.selected) this.list.style.top = '-' + this.selected.offsetTop + 'px';
    }

    highlightOption(dir)
    {
        var next = null;
        switch (dir)
        {
            case 'up':
                next = (this.highlighted - 1 < 0) ? this.highlighted : this.highlighted - 1;
                break;
            case 'down':
                next = (this.highlighted + 1 > this.options.length - 1) ? this.highlighted : this.highlighted + 1;
                break;
            default:
                next = this.highlighted;
        }
        this.options[this.highlighted].classList.remove('hovered');
        this.options[next].classList.add('hovered');
        this.highlighted = next;
    }

    clearFilter()
    {
        this.filter.value = '';
        for (var i = 0; i < this.options.length; i++) this.options[i].style.display = 'block';
    }

    clearFilter()
    {
        this.filter.value = '';

        for (var i = 0; i < this.options.length; i++)
        {
            this.options[i].style.display = 'block';
        }
    }

    closeList()
    {
        this.list.classList.remove('open');
        if (this.options.length && this.options[this.highlighted])
            this.options[this.highlighted].classList.remove('hovered');
    }

    getSettings(settings)
    {
        let defaults = {
            filtered: 'auto',
            filter_threshold: 8,
            filter_placeholder: 'Search'
        };
        for (let p in settings)
            defaults[p] = settings[p];
        return defaults;
    }

    handleSelectKeydown(e)
    {
        if (this.select === document.activeElement && e.keyCode == 32) this.toggleList();
    }

    handleDisplayClick()
    {
        if (this.display.classList.contains("circleLoader")) return;
        if (this._ulist.children.length == 0) return;
        this.list.classList.add('open');
        if (this.isLarge) this.filter.focus();
    }

    handleListKeydown(e)
    {
        return;
        //TODO : Need to Fix
        if (this.list !== document.activeElement) return;
        switch (e.keyCode)
        {
            case 38:
                this.highlightOption('up');
                break;
            case 40:
                this.highlightOption('down');
                break;
            case 13:
                this.value = this.options[this.highlighted].getAttribute('data-value');
                this.selected = this.options[this.highlighted];
                this.display.innerHTML = this.options[this.highlighted].innerHTML;
                this.closeList();
                setTimeout(this.positionList.bind(this), 200);
                this.select.focus();
                break;
        }

    }

    handleFilterKeyup(e)
    {
        var self = this;
        this.options.filter(function (li)
        {
            if (li.innerHTML.toLowerCase().includes(self.filter.value.toLowerCase())) li.style.display = 'block';
            else li.style.display = 'none';
        });
    }

    handleOptionClick(e)
    {
        let value = e.target.getAttribute('data-value');
        if (this.value === value)
        {
            this._setSelectedItem(null);
        }
        else
        {
            this._setSelectedItem(e.target);
        }
        this.dispatchEvent(this.event);
        if (!this.MultiSelect) 
        {
            this.closeList();
            this.clearFilter();
            setTimeout(this.positionList.bind(this), 200);
        }
    }

    _setSelectedItem(liItem)
    {
        for (let i = 0; i < this.selected.length; i++) this.selected[i].classList.remove("selected");
        if (!liItem) return;
        if (Array.isArray(liItem)) this.selected = liItem;
        else
        {
            const index = this.selected.indexOf(liItem);
            if (index > -1) this.selected.splice(index, 1);
            else if (!this.MultiSelect) this.selected = [liItem];
            else this.selected.push(liItem);
        }
        this.value = "";
        for (let i = 0; i < this.selected.length; i++)
        {
            this.selected[i].classList.add("selected");
        }
        this.OnSelectionChanged();
        this._update();
    }

    _update()
    {
        if (this.selected.length > 0)
        {
            if (this.selected.length === 1) this.display.innerHTML = this.selected[0].innerHTML;
            else this.display.innerHTML = this.selected.length + " Selected";
            this.display.style.fontWeight = "bold";
        }
        else
        {
            this.display.innerHTML = this._ulist.children.length == 0 ? this.EmptyText : this.PlaceHolder;
            this.display.style.fontWeight = "normal";
        }
    }

    static get observedAttributes()
    {
        return ['placeholder'].concat(LDiv.observedAttributes);
    }
}

window.document.styleSheets[0].insertRule("l-select{position:relative;}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-select{height:100%;outline: none;position:relative}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-select .value{padding-left:5px;font-weight:bold;font-size:.9em; height:90%; display:block;color:var(--primary_color);border:1px solid rgba(var(--shadow_color_rgb), .1);cursor:pointer;overflow-x:hidden;white-space:nowrap}", window.document.styleSheets[0].cssRules.length);
//window.document.styleSheets[0].insertRule(".l-select .value::after{top: calc(25% - 2px);right: 4px;position: absolute;content: '';border-bottom-width: initial;border-style: solid;border-color: var(--primary_color) transparent transparent transparent;}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-select .value::after{top: calc(50% - 2px);right: 8px;position: absolute;content: '';border-bottom-width: initial;border-style: solid;border-color: var(--primary_color) transparent transparent transparent;}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-select:focus .value{border:1px solid rgba(var(--rgbVal), .8)}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-select .list{position:absolute;top:0!important;width:100%;height:0;background:#fff;opacity:0;outline:0;-webkit-box-shadow:0 2px 9px rgba(0,0,0,.35);box-shadow:0 2px 9px rgba(0,0,0,.35);overflow:hidden;-webkit-transition:opacity .1s cubic-bezier(.39,.575,.565,1);transition:opacity .1s cubic-bezier(.39,.575,.565,1);z-index:9999}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-select .list.open{height:auto;opacity:1}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-select .list .filter{display:none;padding:8px 10px}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-select .list .filter input{width:100%;font-family:helvetica,arial,sans-serif;font-size:12px;color:#1f202a;border:none;border-bottom:1px solid #eaeaea;outline:0;margin:0;padding:0 0 5px}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-select .list ul{margin:0;padding:0}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-select .list ul li{border-radius:4px;list-style:none;font-size:12px;color:#1f202a;padding:8px 10px;cursor:pointer}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-select .list ul li.hovered,.l-select .list ul li:hover{color:#fff;background:rgba(var(--rgbVal), .8)}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-select.large{width:100%!important}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-select.large .filter{display:block}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-select.large .list ul{max-height:200px;overflow-y:scroll}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("l-select > l-div > l-div > ul::-webkit-scrollbar{width:5px}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("l-select > l-div > l-div{padding:5px}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("l-select > l-div, l-select > l-div > l-label{border-radius:inherit;}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("l-select{border-radius:5px}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("l-select > l-div > l-div{border-radius:10px}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("l-select > l-div > l-div > ul > li.selected{font-weight:bold}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("l-select .circleLoader::after {top: calc(20% - 2px)!important;right: 10px!important;border: 3px solid var(--gray);border-radius: 50%;border-top: 3px solid var(--primary_color);animation: l_rotate 1s linear infinite;width: 20;height: 20;}", window.document.styleSheets[0].cssRules.length);

customElements.define("l-select", LSelect);

class LSplit extends LDiv
{
    constructor()
    {
        super();
    }

    _initialize()
    {
        this.style.height = "100%";
        this.style.width = "2px";
        this._attachElements();
    }

    _attachElements()
    {
        this._line = new LDiv();
        this._line.className = "line";
        this._line.style.width = "100%";
        this._line.style.marginTop = "5px";
        this._line.style.height = "calc(100% - 10px)";
        this._line.style.borderLeft = "1px solid var(--gray)";
        this.appendChild(this._line);
    }
}
customElements.define("l-split", LSplit);

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

class LTable extends LDiv
{
    constructor(fetchDataCallback)
    {
        super();
        this._fetchDataCallback = fetchDataCallback ? fetchDataCallback : () => { };
        this._lastSortEle = undefined;
    }

    get ItemsPerPage()
    {
        return this._pagination.ItemsPerPage;
    }

    set ItemsPerPage(val)
    {
        this._pagination.ItemsPerPage = val;
    }

    get TotalItems()
    {
        return this._pagination.TotalItems;
    }

    set TotalItems(val)
    {
        this._pagination.TotalItems = val;
    }

    get StartIndex()
    {
        return this._pagination.StartIndex;
    }

    get CurrentPage()
    {
        return this._pagination.CurrentPage;
    }

    set CurrentPage(val)
    {
        this._pagination.CurrentPage = val;
    }

    get TotalPages()
    {
        return this._pagination.TotalPages;
    }

    get SearchText()
    {
        return this._searchBox.Text;
    }

    get SortText()
    {
        if (!this._lastSortEle) return "";
        return "`" + this._lastSortEle.innerText + "` " + (this._lastSortEle.containsClass("asc") ? "ASC" : "DESC");
    }

    SetData(columns, data, stInd)
    {
        if (!stInd || stInd === -1) stInd = 0;

        let val = this._body.scrollTop / 20;
        let interval = setInterval(() =>
        {
            if (this._body.scrollTop === 0) clearInterval(interval);
            this._body.scrollTop -= val;
        }, 5);
        if (!this._header.element)
        {
            this._header.element = document.createElement("tr");
            this._table.appendChild(this._header.element);
        }
        for (let i = 0; i < columns.length; i++)
        {
            if (!this._header.data[i])
            {
                this._header.data[i] = document.createElement("th");
                // LAnimation.AttachRipple(this._header.data[i], "var(--secondary_color)");
                this._header.data[i].addEventListener("click", () => { this._onHeaderClicked(this._header.data[i]); });
                this._header.element.appendChild(this._header.data[i]);
            }
            this._header.data[i].innerHTML = columns[i];
        }
        let j = 0;
        let dtIndex = stInd;
        for (; j < this.ItemsPerPage && j < data.length - stInd; j++, dtIndex++)
        {
            if (!this._rows[j])
            {
                this._rows[j] = { element: null, data: [] };
                this._rows[j].element = document.createElement("tr");
                this._table.appendChild(this._rows[j].element);
            }
            this._rows[j].element.style.display = "table-row";
            for (let i = 0; i < columns.length; i++)
            {
                if (!this._rows[j].data[i])
                {
                    this._rows[j].data[i] = document.createElement("td");
                    this._rows[j].element.appendChild(this._rows[j].data[i]);
                }
                this._rows[j].data[i].innerHTML = data[dtIndex][i];
            }
        }
        while (j < this._rows.length)
        {
            this._rows[j++].element.style.display = "none";
        }
    }

    ResetSort()
    {
        if (!this._lastSortEle) return;
        this._lastSortEle.removeClass("asc");
        this._lastSortEle.removeClass("desc");
        this._lastSortEle = undefined;
    }


    Reset()
    {
        this.ResetSort();
        this._searchBox.Text = "";
    }

    PageChanged() 
    {

    }

    SearchTextChanged()
    {

    }

    SortHeadChanged(text, order)
    {

    }

    _onHeaderClicked(element)
    {

        if (element.containsClass("asc"))
        {
            element.removeClass("asc");
            element.addClass("desc");
        }
        else
        {
            element.removeClass("desc");
            element.addClass("asc");
        }
        if (this._lastSortEle && this._lastSortEle !== element)
        {
            this._lastSortEle.removeClass("asc");
            this._lastSortEle.removeClass("desc");
        }
        this._lastSortEle = element;
        this.SortHeadChanged(element.innerHTML, element.containsClass("asc") ? "ASC" : "DESC");
    }

    _initialize()
    {
        this._attachElements();
        this._header = { element: null, data: [] };
        this._rows = [];
        super._initialize();
    }

    _attachElements()
    {
        this._attachHeader();
        this._attachBody();
        this._attachFooter();
    }

    _attachHeader()
    {
        this._header = new LDiv();
        this._header.style.width = "100%";
        this._header.style.display = "flex";
        this._header.style.height = "60px";
        this._header.style.position = "relative";
        this._attachHeaderLeft();

        this._attachHeaderRight();
        this.appendChild(this._header);
    }

    _onSearchTextChanged()
    {
        this.ResetSort();
        this.SearchTextChanged();
    }

    _attachHeaderRight()
    {
        this._headerRight = new LDiv();
        this._headerRight.style.position = "absolute";
        this._headerRight.style.display = "flex";
        this._headerRight.style.right = "5px";
        this._headerRight.style.top = "5px";
        this._headerRight.style.height = "50px";

        this._searchBox = new LIconTextBox();
        this._searchBox.style.width = "220px";
        this._searchBox.style.height = "90%";
        this._searchBox.Icon = "search";
        this._searchBox.TextChanged = () => { this._onSearchTextChanged(); };


        this._headerRight.appendChild(this._searchBox);
        this._header.appendChild(this._headerRight);

    }

    _attachHeaderLeft()
    {
        this._headerLeft = new LDiv();
        this._headerLeft.style.display = "flex";
        this._headerLeft.style.height = "50px";
        this._headerLeft.style.marginTop = "5px";

        this._buttonPrint = LTable._getButton("Print");
        this._buttonPrint.addEventListener('click', () => { this._onPrintBtnClicked(); });
        this._buttonPrint.style.marginLeft = "5px";
        // this._headerLeft.appendChild(this._buttonPrint);


        this._buttonCopy = LTable._getButton("Copy");
        this._buttonCopy.addEventListener('click', () => { this._onCopyBtnClicked(); });
        this._headerLeft.appendChild(this._buttonCopy);

        this._buttonCsv = LTable._getButton("CSV");
        this._buttonCsv.addEventListener('click', () => { this._onCsvBtnClicked(); });
        this._headerLeft.appendChild(this._buttonCsv);

        this._header.appendChild(this._headerLeft);
    }


    _onPrintBtnClicked()
    {

    }

    _onCopyBtnClicked()
    {
        this._fetchDataCallback(this.StartIndex, -1, this._searchBox.Text, (res) =>
        {
            LHelper.CopyClipboard(res.map(e => e.join("\t")).join("\n"));
        });
    }

    _onCsvBtnClicked()
    {
        this._fetchDataCallback(this.StartIndex, -1, this._searchBox.Text, (res) =>
        {
            LHelper.DownloadCSV(res, "Today.csv");
        });
    }

    _attachBody()
    {
        this._body = new LDiv();
        this._body.style.borderRadius = "10px 10px 3px 3px;";
        this._body.style.height = "calc(100% - 130px)";
        this._body.style.overflowY = "auto";
        this._table = document.createElement("table");
        this._table.className = "l-table";
        this._body.appendChild(this._table);
        this.appendChild(this._body);
    }

    _attachFooter()
    {
        this._footer = new LDiv();
        this._footer.style.height = "65px";
        this._footer.style.padding = "2px";
        this._footer.style.paddingTop = "12px";
        this._footer.style.width = '100%';
        this._footer.style.position = 'relative';
        this._pagination = new LPagination();
        this._pagination.style.width = '100%';
        this._pagination.style.height = '80%';
        // this._pagination.style.position = "absolute";
        // this._pagination.style.right = "2";

        this._pagination.PageChanged = (stInd, itemsPerPg) => { this._fetchDataCallback(stInd, itemsPerPg); this.PageChanged(); };
        this._footer.appendChild(this._pagination);
        this.appendChild(this._footer);
    }

    static _getButton(text)
    {
        let button = new LButton();
        button.innerHTML = text;
        button.style.border = "1px solid rgba(var(--rgbVal), .1)";
        button.style.borderRadius = "8px";
        button.style.backgroundColor = "var(--secondary_color)";
        button.style.color = "var(--primary_color)";
        button.style.fontWeight = "bolder";
        button.style.width = "80px";
        button.style.height = "75%";
        button.style.marginTop = "3px";
        button.style.marginLeft = "5px";
        button.style.boxShadow = "0 4px 5px 0 var(--shadow_color),0 1px 2px 0 var(--shadow_color),0 1px 1px -1px var(--shadow_color)";
        LAnimation.AttachRipple(button, "rgba(var(--rgbVal), .2)");
        return button;
    }

    static get observedAttributes()
    {
        return [].concat(LDiv.observedAttributes);
    }
}
window.document.styleSheets[0].insertRule(".l-table{border-radius:5px 5px 3px 3px; margin-left:5px;margin-right:5px;background-color:var(--secondary_color);border-spacing: 1px;margin-top:-2px;width:calc(100% - 10px);border-radius:10px 10px 5px 5px;border:1px solid rgba(var(--grayRgbVal), .5)}", window.document.styleSheets[0].cssRules.length);

window.document.styleSheets[0].insertRule(".l-table tr{border:1px solid rgba(var(--grayRgbVal), .2)}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table tr{background-color:var(--secondary_color)}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table tr:hover{background-color:rgba(var(--rgbVal), .1)!important}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table tr:nth-child(odd){background-color:rgba(var(--rgbVal), .03)}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table th{display:none;background-color:var(--secondary_color);color:var(--primary_color);border-bottom: 3px solid rgba(var(--rgbVal), 1);padding:.7em;position:sticky!important;top:0!important}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table th:first-child{display:table-cell;text-align:center}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table th:first-child{border-radius:5px 3px 0 0}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table th:last-child{border-radius:3px 5px 0 0}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table th:nth-child(2){display:table-cell}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table th:nth-child(2) span{display:none}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table td{max-width: none;}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table th:nth-child(2)  {border-radius:3px 10px 0 0}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table th:nth-child(2):after{content:attr(data-th);border-radius:3px 10px 0 0}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("@media (min-width:900px){.l-table td{max-width: none;} .l-table th:nth-child(2)  {border-radius:3px 3px 0 0}.l-table th:nth-child(2) span{display:block}.l-table th:nth-child(2):after{display:none}}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table td{display:block;word-wrap:break-word;}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table td:first-child{display:table-cell;text-align:center;border-right:1px solid rgba(var(--grayRgbVal), .2)}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("@media (min-width:900px){.l-table td{max-width: none;} .l-table td{border:1px solid rgba(var(--grayRgbVal), .2)}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table td,.l-table th{text-align:left;margin:.5em 1em}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("@media (min-width:900px){.l-table td{max-width: none;} .l-table td,.l-table th{display:table-cell;padding:.7em}}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table th{border-radius:3px 3px 0 0;}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table tr:last-child td{border-radius:0 0 3px 3px;}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table th{user-select:none}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table th:after{  top: calc(50% - 2px);right: 8px;position: absolute;content: '';display: none;border-bottom: none;" +
    "border-style: solid;border-top-style: solid;border-right-style: solid;border-bottom-style: solid;" +
    "border-left-style: solid;border-color: var(--primary_color) transparent;}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table th.asc:after{border-width: 0px 4px 4px;display:block}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table th.desc:after{border-width: 4px 4px 0px;display:block}", window.document.styleSheets[0].cssRules.length);
customElements.define("l-table", LTable);

class LTabPage extends LDiv
{
    constructor()
    {
        super();
        this._currentDispVal = "block";
    }

    get Active()
    {
        return this.getAttribute("active");
    }

    set Active(value)
    {
        this.setAttribute("active", value);
    }

    get GroupName()
    {
        return this.getAttribute("group-name");
    }

    set GroupName(val)
    {
        this.setAttribute("group-name", val);
    }

    _initialize()
    {
        if (!this.getAttribute("group-name")) this.setAttribute("group-name", "default");
        this.attrbs['group-name'] = (value) => { this._onGroupNameChanged(value); };
        this.attrbs['active'] = (value) => { this._onTabActiveValueChanged(value); };
        super._initialize();
    }

    _hide()
    {
        this.Active = "false";
    }

    _show()
    {
        this.Active = "true";
    }

    _onTabActiveValueChanged(value)
    {
        this._onGroupNameChanged(this.GroupName);
        if (this.style.display !== "none") this._currentDispVal = this.style.display;
        if (value && value === "true")
        {
            if(this.style.display != this._currentDispVal) LAnimation.UnFade(this, 10);
            this.style.display = this._currentDispVal;
        }
        else
        {
            LAnimation.Fade(this, 10);
            this.style.display = "none";
        }
        LTabPage._onTabChanged(this);
    }

    _onGroupNameChanged(value)
    {
        if (!LTabPage.TabGroups[value])
        {
            LTabPage.TabGroups[value] = [];
        }
        if (LTabPage.TabGroups[value].indexOf(this) === -1)
        {
            LTabPage.TabGroups[value].push(this);
        }
    }

    static _onTabChanged(page)
    {
        if (LTabPage._isInternalCall) return;
        LTabPage._isInternalCall = true;
        if (page.Active === "true")
        {
            for (let i = 0; i < LTabPage.TabGroups[page.GroupName].length; i++)
            {
                if (LTabPage.TabGroups[page.GroupName][i] != page)
                {
                    LTabPage.TabGroups[page.GroupName][i]._hide();
                }
            }
        }
        else
        {
            let isNoTabsActive = true;
            for (let i = 0; i < LTabPage.TabGroups[page.GroupName].length; i++)
            {
                if (LTabPage.TabGroups[page.GroupName][i].Active === "true")
                {
                    isNoTabsActive = false;
                    break;
                }
                LTabPage.TabGroups[page.GroupName][0]._show();;
            }
        }
        LTabPage._isInternalCall = false;
    }

    static get observedAttributes()
    {
        return ['group-name', 'active'].concat(LDiv.observedAttributes);
    }
}
LTabPage.TabGroups = {};
customElements.define("l-tabpage", LTabPage);

class APIHandler
{
    static CreateApiCall(apiFilePath, data, callbackFuction, isNonParseCheck)
    {
        return new Promise((resolve, reject) =>
        {
            fetch(apiFilePath,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
                .then(async function (response)
                {
                    if (!callbackFuction) callbackFuction = () => { };
                    let resultData = await response.text();
                    function returnCall(data)
                    {
                        if (data.Result)
                        {
                            resolve(resultData.Value);
                            callbackFuction(resultData.Value);
                        }
                        else if(resultData.Message != "")
                        {
                            console.error(resultData.Message)
                        }
                    }
                    if (isNonParseCheck)
                    {
                        returnCall(resultData);
                        return;
                    }
                    try
                    {
                        resultData = JSON.parse(resultData);
                        returnCall(resultData);
                    }
                    catch (e)
                    {
                        console.error(e);
                        console.error(resultData);
                        let result = { "Result": false };
                        result["Message"] += resultData;
                        let errorWindow = window.open("", "Error Window", "width=1000,height=1000");
                        let data = result["Message"];
                        errorWindow.document.write(data);
                        resultData = result;
                        resolve();
                        returnCall("");
                    }
                })
                .catch(function (error)
                {
                    console.warn(error);
                    resolve();
                });
        });
    }

    static CreateApiCallAjax(apiFilePath, data, callbackFuction, isNonParseCheck) // Need TO include JQuery
    {
        $.ajax({
            type: "POST",
            url: apiFilePath,
            data: JSON.stringify(data),
            headers: { 'Accept': 'application/json' },
            success: function (resultData)
            {
                function returnCall(data)
                {
                    if (data.Result)
                    {
                        callbackFuction(resultData.Value);
                    }
                    else
                    {
                        console.error(resultData.Message)
                    }
                }
                if (isNonParseCheck)
                {
                    returnCall(resultData);
                    return;
                }
                try
                {
                    resultData = JSON.parse(resultData);
                    returnCall(resultData);
                }
                catch (e)
                {
                    console.error(e);
                    console.error(resultData);
                    let result = { "Result": false };
                    result["Message"] += resultData;
                    let errorWindow = window.open("", "Error Window", "width=1000,height=1000");
                    let data = result["Message"];
                    errorWindow.document.write(data);
                    resultData = result;
                    returnCall("");
                }
            },
            error: function (response)
            {
                console.warn(response);
            }
        });
    }
}
window.APIHandler = APIHandler;


class LHTML extends HTMLElement 
{
  constructor()
  {
    super();
  }

  get path() 
  {
    return this.getAttribute('path');
  }

  set path(newValue) 
  {
    this.setAttribute('path', newValue);
  }

  static get observedAttributes() 
  {
    return ['path'];
  }

  attributeChangedCallback(name, oldValue, newValue) 
  {
    if (name == "path")
    {
      let fileName = newValue + "\\" + newValue;
      if(this.getAttribute("prefix")) fileName = this.getAttribute("prefix")+"\\"+fileName;
      fileName = "pages\\" + fileName;
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = (e) =>
      {
        if (xhttp.readyState == 4)
        {
          if (xhttp.status == 200) { this.innerHTML = xhttp.responseText; }
          if (xhttp.status == 404) { this.innerHTML = "Page not found."; }
          // this.removeAttribute("path");
          // includeHTML();
        }
      }
      xhttp.open("GET", fileName + ".html", true);
      xhttp.send();
      FileIncluder.LoadCss(fileName + ".css");
      let loaded = false;
      FileIncluder.LoadJs(fileName + ".js", () => { loaded = true });
      function waitForIt()
      {
        if (!loaded) { setTimeout(() => { waitForIt() }, 100); }
      }
      waitForIt();
    }
  }

}

customElements.define("l-html", LHTML);

class FileIncluder
{
  static LoadHTML()
  {
    var z, i, elmnt, file, xhttp;
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++)
    {
      elmnt = z[i];
      file = elmnt.getAttribute("lhtml");
      if (file)
      {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function ()
        {
          if (this.readyState == 4)
          {
            if (this.status == 200) { elmnt.innerHTML = this.responseText; }
            if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
            elmnt.removeAttribute("lhtml");
            includeHTML();
          }
        }
        xhttp.open("GET", file, true);
        xhttp.send();
        return;
      }
    }
  }

  static async LoadJs(fileName, callback)
  {
    return new Promise(function (myResolve, myReject)
    {

      var script = document.createElement("script");
      script.type = "application/javascript";
      script.onload =
        () =>
        {
          myResolve();
          if(callback) callback();
        };
      script.src = fileName;
      document.head.appendChild(script);
    });
  }

  static LoadCss(fileName, parent)
  {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = fileName;
    link.media = 'all';
    if(parent) parent.head.appendChild(link);
    else document.head.appendChild(link);
  }

}


window.FileIncluder = FileIncluder;

class LHelper
{
    static DownloadCSV2(data, fileName)
    {
        let csvContent = "data:text/csv;charset=utf-8,"
            + data.map(e => e.join(",")).join("\n");
        let encodedUri = encodeURI(csvContent);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    static DownloadCSV(data, fileName)
    {
        function getStringData(data, ind)
        {
            let str = "";
            if (Array.isArray(data))
            {
                let suffix = "";
                for (let i = 0; i < data.length; i++)
                {
                    let newStr = getStringData(data[i], ind + i);
                    if (newStr[newStr.length - 1] === '\n') suffix = "";
                    if (newStr[newStr.length - 1] === ',') suffix = "";
                    str += suffix + newStr;
                    suffix = ",";
                }
                str += "\n";
            }
            else
            {
                str = "\"" + data + "\"";
            }
            return str;
        }
        let csvContent = "data:text/csv;charset=utf-8," + getStringData(data, 0);
        let encodedUri = encodeURI(csvContent);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        if (!fileName.includes(".csv")) fileName += ".csv";
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    static CopyClipboard(data)
    {
        let dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = data;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
    }
}
window.LHelper = LHelper;
window.pendingDebug = { warn: [], log: [], error: [], dir: [] };
window.defaultConsole = window.console;
window.lConsole = {
    log: (e)=>{ window.pendingDebug.log.push(e); },
    warn: (e)=>{ window.pendingDebug.warn.push(e); },
    error: (e)=>{ window.pendingDebug.error.push(e); },
    dir:(e)=>{ window.pendingDebug.dir.push(e); },
};
window.SetLDebugging = (enable) =>
{
    if (enable)
    {
        window.console = window.defaultConsole;
        for(let i = 0; i < window.pendingDebug.log.length;i++) console.log(window.pendingDebug.log[i]);
        for(let i = 0; i < window.pendingDebug.warn.length;i++) console.warn(window.pendingDebug.warn[i]);
        for(let i = 0; i < window.pendingDebug.error.length;i++) console.error(window.pendingDebug.error[i]);
        for(let i = 0; i < window.pendingDebug.dir.length;i++) console.dir(window.pendingDebug.dir[i]);
        window.pendingDebug = { warn: [], log: [], error: [], dir: [] };
    }
    else window.console = window.lConsole;
};

window.SetLDebugging(false);

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

class LAnimation
{
    static AttachRipple(element, customColor)
    {
        element.addEventListener("click", function(e) {
            this.style.position = "relative";
            this.style.overflow = "hidden";
            let rect = element.getBoundingClientRect();
            let X = e.pageX - rect.left;
            let Y = e.pageY - rect.top;
            let rippleDiv = document.createElement("div");
            rippleDiv.classList.add('l_ripple');
            rippleDiv.setAttribute("style","top:"+Y+"px; left:"+X+"px;");
            if(customColor) rippleDiv.style.background = customColor;
            this.appendChild(rippleDiv);
            setTimeout(function(){
              rippleDiv.parentElement.removeChild(rippleDiv);
            }, 900);
        });
    }

    static Fade(element, interval)
    {
        if(element.getAttribute("currentAnimation"))
        {
            clearInterval(element.getAttribute("currentAnimation"));
        }
        if (!interval) interval = 10;
        let op = 1;  // initial opacity
        let timer = setInterval(function ()
        {
            if (op <= 0.1)
            {
                clearInterval(timer);
                element.style.display = 'none';
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op -= op * 0.1;
        }, 50);
        element.setAttribute("currentAnimation", timer);
    }

    static UnFade(element, interval)
    {
        if(element.getAttribute("currentAnimation"))
        {
            clearInterval(element.getAttribute("currentAnimation"));
        }
        if (!interval) interval = 10;
        let op = 0.1;  // initial opacity
        element.style.display = 'block';
        let timer = setInterval(function ()
        {
            if (op >= 1)
            {
                clearInterval(timer);
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op += op * 0.1;
        }, 10);
        element.setAttribute("currentAnimation", timer);
    }
}

window.document.styleSheets[0].insertRule(".l_ripple{position: absolute;background: #fff;border-radius: 50%;width: 5px;height: 5px;animation: l_rippleEffect .88s 1;opacity: 0;}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("@keyframes l_rippleEffect {0% {transform: scale(1);opacity: 0.4;}100% {transform: scale(100);opacity: 0;}}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("@keyframes l_rotate {0% {transform: rotate(0deg);}100% {transform: rotate(360deg);}}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("@keyframes l_fadeIn {0% {0% {opacity: 0;}100% {0% {opacity: 1;}}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("@keyframes l_fadeOut {0% {0% {opacity: 1;}100% {0% {opacity: 0;}}", window.document.styleSheets[0].cssRules.length);