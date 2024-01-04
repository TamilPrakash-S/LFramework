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