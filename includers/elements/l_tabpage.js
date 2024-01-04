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