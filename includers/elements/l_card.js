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