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
